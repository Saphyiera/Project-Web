import express from "express"
import multer from 'multer'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { v4 as uuidv4} from 'uuid'
import { route } from "./api/routes/index.js"
import connection from "./db/connect.js"
import { fileURLToPath } from 'url'

const app = express();

app.use(express.json());
app.use(cors());
route(app);

// Chuyển đổi `import.meta.url` thành __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình để phục vụ tệp tĩnh từ thư mục "public"
app.use(express.static(path.join(__dirname, '../public')));

// Cấu hình view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

dotenv.config();
const port = process.env.PORT;

// API Creation
app.get("/", (req, res) => {
    res.send("Epress App is running")
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        return cb(null, uniqueFilename);
    }
});

const upload = multer({storage: storage});

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.any(), (req, res) => {
    const fileNames = req.files.map(file => file.filename);
    res.status(200).json({
        success: 1,
        image_urls: fileNames.map(filename => `http://localhost:${port}/images/${filename}`)
    });
});

connection.then(() => {
    app.listen(port, (error) => {
        if (!error) {
            console.log(`Server is running on port ${port}. http://localhost:${port}`);
        } else {
            console.log('Error' + error);
        }
    });
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});