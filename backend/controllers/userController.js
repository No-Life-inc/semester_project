export const handleCallback = (req, res) => {
  res.redirect("/dashboard");
};

export const getDashboard = (req, res) => {
  res.send("Hello from dashboard!");
};