const express = require('express');
const { nanoid } = require('nanoid');
const validator = require('validator');
const Url = require('../models/Url');

const router = express.Router();

// Route 1: Create shortened URL
// POST /api/urls/shorten
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl, shortcode, validityDays = 30 } = req.body;

    // Validate original URL
    if (!originalUrl || !validator.isURL(originalUrl)) {
      return res.status(400).json({ 
        error: 'Please provide a valid URL' 
      });
    }

    // Validate validity days
    if (validityDays < 1 || validityDays > 365) {
      return res.status(400).json({ 
        error: 'Validity must be between 1 and 365 days' 
      });
    }

    // Check if custom name is provided and valid
    let shortCode;
    if (shortcode) {
      // Validate custom name (alphanumeric and hyphens only)
      if (!/^[a-zA-Z0-9-]+$/.test(shortcode)) {
        return res.status(400).json({ 
          error: 'Custom name can only contain letters, numbers, and hyphens' 
        });
      }

      // Check if custom name already exists
      const existingUrl = await Url.findOne({ shortCode: shortcode });
      if (existingUrl) {
        return res.status(409).json({ 
          error: 'Custom name already exists. Please choose a different one.' 
        });
      }
      shortCode = shortcode;
    } else {
      // Generate random short code
      shortCode = nanoid(8);
      
      // Ensure uniqueness
      let isUnique = false;
      while (!isUnique) {
        const existingUrl = await Url.findOne({ shortCode });
        if (!existingUrl) {
          isUnique = true;
        } else {
          shortCode = nanoid(8);
        }
      }
    }

    // Calculate validity date
    const validity = new Date();
    validity.setDate(validity.getDate() + validityDays);

    // Create new URL document
    const url = new Url({
      originalUrl,
      shortCode,
      customName: shortcode || null,
      validity
    });

    await url.save();

    res.status(201).json({
      success: true,
      data: {
        // originalUrl,
        shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
        // shortCode,
        // customName: customName || null,
        validity: validity.toISOString(),
        // expiresIn: `${validityDays} days`
      }
    });

  } catch (error) {
    console.error('Error creating shortened URL:', error);
    res.status(500).json({ 
      error: 'Failed to create shortened URL' 
    });
  }
});

// Route 2: Get URL statistics (MUST come before the general /:shortCode route)
// GET /api/urls/stats/:shortCode
router.get('/shorturls/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });
    
    if (!url) {
      return res.status(404).json({ 
        error: 'URL not found' 
      });
    }

    // Check if URL is expired
    const isExpired = new Date() > url.validity;
    
    // Calculate time remaining
    const timeRemaining = isExpired ? 0 : Math.ceil((url.validity - new Date()) / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        customName: url.customName,
        shortUrl: `${req.protocol}://${req.get('host')}/api/urls/${url.shortCode}`,
        validity: url.validity.toISOString(),
        isExpired,
        timeRemaining: isExpired ? 'Expired' : `${timeRemaining} days`,
        clicks: url.clicks,
        createdAt: url.createdAt.toISOString(),
        lastAccessed: url.lastAccessed.toISOString(),
        uniqueVisitors: url.ipAddresses.length,
        isActive: url.isActive && !isExpired
      }
    });

  } catch (error) {
    console.error('Error fetching URL statistics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch URL statistics' 
    });
  }
});

// Route 3: Redirect to original URL (MUST come after more specific routes)
// GET /api/urls/:shortCode
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });
    
    if (!url) {
      return res.status(404).json({ 
        error: 'URL not found' 
      });
    }

    // Check if URL is expired
    if (new Date() > url.validity) {
      return res.status(410).json({ 
        error: 'This URL has expired' 
      });
    }

    // Check if URL is active
    if (!url.isActive) {
      return res.status(410).json({ 
        error: 'This URL is no longer active' 
      });
    }

    // Update statistics
    url.clicks += 1;
    url.lastAccessed = new Date();
    
    // Track unique visitors (basic implementation)
    const clientIP = req.ip || req.connection.remoteAddress;
    if (!url.ipAddresses.includes(clientIP)) {
      url.ipAddresses.push(clientIP);
    }
    
    // Track user agent
    const userAgent = req.get('User-Agent');
    if (userAgent && !url.userAgent.includes(userAgent)) {
      url.userAgent.push(userAgent);
    }

    await url.save();

    // Redirect to original URL
    res.redirect(url.originalUrl);

  } catch (error) {
    console.error('Error redirecting URL:', error);
    res.status(500).json({ 
      error: 'Failed to redirect to URL' 
    });
  }
});

module.exports = router;
