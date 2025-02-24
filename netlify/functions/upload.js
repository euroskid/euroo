const fetch = require("node-fetch");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    const body = JSON.parse(event.body);
    const { fileName, fileData } = body;
    if (!fileName || !fileData) return { statusCode: 400, body: "Invalid Data" };

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;
    const BUCKET_NAME = "uploads";

    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${fileName}`;
    const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "image/png" },
        body: Buffer.from(fileData, "base64"),
    });

    if (!response.ok) return { statusCode: 500, body: "Upload Failed" };

    return {
        statusCode: 200,
        body: JSON.stringify({ url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}` }),
    };
};
