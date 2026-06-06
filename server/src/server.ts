import "dotenv/config";
import app from "./app.js";


const PORT = process.env.PORT || 5000;

app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`SERVER RUNNING ON PORT: ${PORT}`);
});