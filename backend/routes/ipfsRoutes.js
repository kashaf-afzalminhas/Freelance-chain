const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'ipfs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename using timestamp and random string
        const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(8).toString('hex');
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Route for uploading files
router.post('/upload-to-ipfs', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        // Store the file information
        const fileInfo = {
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadDate: new Date().toISOString()
        };

        // Store file metadata in a JSON file
        const metadataDir = path.join(__dirname, '..', 'uploads', 'ipfs', 'metadata');
        if (!fs.existsSync(metadataDir)) {
            fs.mkdirSync(metadataDir, { recursive: true });
        }
        const metadataPath = path.join(metadataDir, `${req.file.filename}.json`);
        fs.writeFileSync(metadataPath, JSON.stringify(fileInfo, null, 2));

        console.log('File uploaded successfully:', {
            hash: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            path: req.file.path
        });

        res.status(200).json({
            success: true,
            hash: req.file.filename,
            message: 'File uploaded successfully',
            fileInfo: {
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        console.error('IPFS upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload file: ' + error.message
        });
    }
});

// Route for downloading files
router.get('/download/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        console.log('Download requested for hash:', hash);
        
        // Decode the hash to handle special characters
        const decodedHash = decodeURIComponent(hash);
        console.log('Decoded hash:', decodedHash);
        
        // Get the file path from the hash
        const filePath = path.join(__dirname, '..', 'uploads', 'ipfs', decodedHash);
        console.log('Looking for file at path:', filePath);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error('File not found at path:', filePath);
            
            // List files in the directory to help debug
            const uploadDir = path.join(__dirname, '..', 'uploads', 'ipfs');
            const files = fs.readdirSync(uploadDir);
            console.log('Available files in uploads directory:', files);
            
            return res.status(404).json({
                success: false,
                error: 'File not found',
                fileInfo: {
                    exists: false,
                    hash: decodedHash,
                    requestedPath: filePath,
                    availableFiles: files
                }
            });
        }

        // Try to get metadata
        const metadataPath = path.join(__dirname, '..', 'uploads', 'ipfs', 'metadata', `${decodedHash}.json`);
        let metadata = null;
        if (fs.existsSync(metadataPath)) {
            try {
                const metadataContent = fs.readFileSync(metadataPath, 'utf8');
                metadata = JSON.parse(metadataContent);
                console.log('Metadata found:', metadata);
            } catch (metadataError) {
                console.warn('Failed to read metadata:', metadataError.message);
            }
        } else {
            console.warn('No metadata file found for hash:', decodedHash);
        }

        // Get file stats
        const stats = fs.statSync(filePath);
        console.log('File stats:', { size: stats.size });
        
        // Determine filename and encode it for the Content-Disposition header
        const filename = metadata?.originalName || `file-${decodedHash}`;
        const encodedFilename = encodeURIComponent(filename);
        const contentType = metadata?.mimetype || 'application/octet-stream';
        
        // Set appropriate headers
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`);
        res.setHeader('Cache-Control', 'no-cache');
        
        console.log('Starting file stream for:', filename);
        
        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        
        fileStream.on('error', (error) => {
            console.error('Error streaming file:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: 'Error streaming file: ' + error.message
                });
            }
        });

        fileStream.on('end', () => {
            console.log('File stream completed successfully');
        });
        
        fileStream.pipe(res);
        
    } catch (error) {
        console.error('IPFS download error:', error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: 'Failed to download file: ' + error.message
            });
        }
    }
});

// Route to get file info without downloading
router.get('/info/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        console.log('Info requested for hash:', hash);
        
        // Decode the hash to handle special characters
        const decodedHash = decodeURIComponent(hash);
        console.log('Decoded hash:', decodedHash);
        
        // Get the file path from the hash
        const filePath = path.join(__dirname, '..', 'uploads', 'ipfs', decodedHash);
        console.log('Looking for file at path:', filePath);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error('File not found at path:', filePath);
            
            // List files in the directory to help debug
            const uploadDir = path.join(__dirname, '..', 'uploads', 'ipfs');
            const files = fs.readdirSync(uploadDir);
            console.log('Available files in uploads directory:', files);
            
            return res.status(404).json({
                success: false,
                error: 'File not found',
                fileInfo: {
                    exists: false,
                    hash: decodedHash,
                    requestedPath: filePath,
                    availableFiles: files
                }
            });
        }

        // Try to get metadata
        const metadataPath = path.join(__dirname, '..', 'uploads', 'ipfs', 'metadata', `${decodedHash}.json`);
        let metadata = null;
        if (fs.existsSync(metadataPath)) {
            try {
                metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                console.log('Metadata found:', metadata);
            } catch (metadataError) {
                console.warn('Failed to read metadata:', metadataError.message);
            }
        } else {
            console.warn('No metadata file found for hash:', decodedHash);
        }

        // Get file stats
        const stats = fs.statSync(filePath);
        console.log('File stats:', { size: stats.size });
        
        res.json({
            success: true,
            fileInfo: {
                hash: decodedHash,
                originalName: metadata?.originalName || 'Unknown',
                size: stats.size,
                mimetype: metadata?.mimetype || 'application/octet-stream',
                uploadDate: metadata?.uploadDate || stats.birthtime,
                exists: true,
                path: filePath
            }
        });
        
    } catch (error) {
        console.error('Error getting file info:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get file info: ' + error.message
        });
    }
});

module.exports = router; 