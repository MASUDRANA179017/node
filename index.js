const fs = require("fs/promises");

(async () => {
  // Commands
  const CREATE_BUTTON = "create button";
  const CREATE_NAVBAR = "create navbar";
  const CREATE_BANNER = "create banner";
  const CREATE_SIDEMENU = "create sidemenu";
  const CREATE_ABOUT = "create about";
  const CREATE_BLOG = "create blog";
  

  const indexPath = "./index.html"; // Define the main HTML file path

  // Initialize or update the HTML file if it doesn't exist
  const initializeHTMLFile = async () => {
    try {
      await fs.access(indexPath);
    } catch (e) {
      const initialContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic HTML Elements</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
  <div class="flex">
    <!-- Sidebar will be injected here -->
    <div id="sidebar"></div>
    <!-- Main Content Area -->
    <div id="main-content" class="flex-1 p-4 ml-52"></div>
  </div>
</body>
</html>`;
      await fs.writeFile(indexPath, initialContent, "utf-8");
    }
  };

  // Helper to append content inside the specified section
  const appendToSection = async (sectionId, content) => {
    const html = await fs.readFile(indexPath, "utf-8");
    const updatedHTML = html.replace(
      `<div id="${sectionId}"></div>`,
      `<div id="${sectionId}">${content}</div>`
    );
    await fs.writeFile(indexPath, updatedHTML, "utf-8");
  };

  // Append functions
  const appendSidebarToHTML = async () => {
    const sideMenuHTML = `
      <div class="bg-gray-800 text-white p-4 space-y-2 fixed h-full w-48">
        <a href="#home" class="block py-2">Home</a>
        <a href="#about" class="block py-2">About</a>
        <a href="#blog" class="block py-2">Blog</a>
        <a href="#contact" class="block py-2">Contact</a>
      </div>`;
    await appendToSection("sidebar", sideMenuHTML);
  };

  const appendButtonToHTML = async (color = "green") => {
    const buttonHTML = `<button class="bg-${color}-500 text-white px-6 py-2 rounded">Custom Button</button>`;
    await appendToSection("main-content", buttonHTML);
  };

  const appendNavbarToHTML = async () => {
    const navbarHTML = `<div class="bg-gray-800 p-4 text-white flex justify-around">
      <a href="#home">Home</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a>
    </div>`;
    await appendToSection("main-content", navbarHTML);
  };

  const appendBannerToHTML = async () => {
    const bannerHTML = `<div class="bg-blue-500 text-white p-8 text-center text-3xl font-bold">Welcome to Our Website</div>`;
    await appendToSection("main-content", bannerHTML);
  };

  const appendAboutSection = async () => {
    const aboutHTML = `<section class="p-8 bg-white shadow-md rounded my-4">
      <h2 class="text-2xl font-bold mb-4">About Us</h2>
      <p>This is the about section where you can learn more about us.</p>
    </section>`;
    await appendToSection("main-content", aboutHTML);
  };

  const appendBlogSection = async () => {
    const blogHTML = `<section class="p-8 bg-white shadow-md rounded my-4">
      <h2 class="text-2xl font-bold mb-4">Blog</h2>
      <p>Our latest blog posts will appear here.</p>
    </section>`;
    await appendToSection("main-content", blogHTML);
  };

  // Read command from the command.txt file
  const commandFile = "./command.txt";

  const handleCommand = async (command) => {
    await initializeHTMLFile();

    // Handle different commands
    if (command.startsWith(CREATE_BUTTON)) {
      const color = command.split(" ").slice(2).join(" ") || "green";
      await appendButtonToHTML(color);
    } else if (command === CREATE_NAVBAR) {
      await appendNavbarToHTML();
    } else if (command === CREATE_BANNER) {
      await appendBannerToHTML();
    } else if (command === CREATE_SIDEMENU) {
      await appendSidebarToHTML();
    } else if (command === CREATE_ABOUT) {
      await appendAboutSection();
    } else if (command === CREATE_BLOG) {
      await appendBlogSection();
    }
  };

  // Watcher to monitor the command.txt file
  const watcher = fs.watch(commandFile);
  for await (const event of watcher) {
    if (event.eventType === "change") {
      const command = (await fs.readFile(commandFile, "utf-8")).trim();
      await handleCommand(command);
      console.log(`Executed: ${command}`);
    }
  }
})();
