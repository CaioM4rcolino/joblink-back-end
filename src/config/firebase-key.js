module.exports = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,  
  private_key_id: "e333118a70e4bae35a73a0d330b47eb07b12f6ec",
  private_key: process.env.FIREBASE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: "105662571709449503123",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-azlqy%40joblinkproject.iam.gserviceaccount.com"
}
