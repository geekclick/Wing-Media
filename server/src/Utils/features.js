import { getBase64, getSockets } from "../Helpers/index.js";
import { v2 as cloudinary } from "cloudinary"
import { v4 as uuidv4 } from "uuid";


const emitEvent = (req, event, users, data) => {
    const io = req.app.get("io");
    const usersSocket = getSockets(users);
    io.to(usersSocket).emit(event, data);
};

const uploadFileToCloudinary = async (file, folderName = '/wing/post') => {
    try {
        const base64File = await getBase64(file);
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                base64File,
                {
                    resource_type: "auto",
                    public_id: uuidv4(),
                    folder: folderName
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            );
        });
    } catch (error) {
        throw new Error('Failed to convert file to Base64: ' + error.message);
    }
};

const deleteFileFromCloudinary = async (publicId, type = "image") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, { resource_type: type }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};

export { emitEvent, uploadFileToCloudinary, deleteFileFromCloudinary }