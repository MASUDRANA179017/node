const fs = require("fs/promises");

(async () => {
  // Commands
  const CREATE_BUTTON = "create button";
  const CREATE_NAVBAR = "create navbar";
  const CREATE_BANNER = "create banner";
  const CREATE_SIDEMENU = "create sidemenu";
  const CREATE_ABOUT = "create about";
  const CREATE_BLOG = "create blog";
  const CREATE_CONTACT = "create contact";
  const CREATE_HEADER = "create header";
  const CREATE_FOOTER = "create footer";

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
      </body>
      </html>`;
      await fs.writeFile(indexPath, initialContent, "utf-8");
    }
  };


  // Helper to append content inside the <body> tag
  const appendToBody = async (content) => {
    const html = await fs.readFile(indexPath, "utf-8");
    const updatedHTML = html.replace("</body>", ${content}\n</body>);
    await fs.writeFile(indexPath, updatedHTML, "utf-8");
  };

  // Section append functions
  const appendButtonToHTML = async (color = "#4CAF50") => {
    const buttonHTML = <button class="bg-${color}-500 text-white px-6 py-2 rounded">Custom Button</button>;
    await appendToBody(buttonHTML);
  };

  const appendNavbarToHTML = async () => {
    const navbarHTML = `<div class="bg-gray-800 p-4 text-white flex justify-around">
      <a href="#home">Home</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a>
    </div>`;
    await appendToBody(navbarHTML);
  };

  const appendBannerToHTML = async () => {
    const bannerHTML = <div class="bg-blue-500 text-white p-8 text-center text-3xl font-bold">Welcome to Our Website</div>;
    await appendToBody(bannerHTML);
  };

  const appendSideMenuToHTML = async () => {
    const sideMenuHTML = `<div class="bg-gray-800 text-white p-4 space-y-2 fixed h-full w-48">
      <a href="#home" class="block py-2">Home</a><a href="#about" class="block py-2">About</a>
      <a href="#blog" class="block py-2">Blog</a><a href="#contact" class="block py-2">Contact</a>
    </div>`;
    await appendToBody(sideMenuHTML);
  };

  const appendAboutSection = async () => {
    const aboutHTML = `<section class="p-8 bg-white shadow-md rounded my-4">
      <h2 class="text-2xl font-bold mb-4">About Us</h2>
      <p>This is the about section where you can learn more about us.</p>
    </section>`;
    await appendToBody(aboutHTML);
  };

  const appendBlogSection = async () => {
    const blogHTML = `<section class="p-8 bg-white shadow-md rounded my-4">
      <h2 class="text-2xl font-bold mb-4">Blog</h2>
      <p>Our latest blog posts will appear here.</p>
    </section>`;
    await appendToBody(blogHTML);
  };

  const appendContactSection = async () => {
    const contactHTML = `<section class="p-8 bg-white shadow-md rounded my-4">
      <h2 class="text-2xl font-bold mb-4">Contact Us</h2>
      <p>Get in touch with us through the contact form below.</p>
    </section>`;
    await appendToBody(contactHTML);
  };

  const appendHeaderToHTML = async () => {
    const headerHTML = <header class="bg-blue-600 text-white p-4 text-center text-2xl font-bold">Header</header>;
    await appendToBody(headerHTML);
  };

  const appendFooterToHTML = async () => {
    const footerHTML = <footer class="bg-gray-900 text-white p-4 text-center text-sm">© 2024 Your Company</footer>;
    await appendToBody(footerHTML);
  };




  // Watch for commands in command.txt
  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    const size = (await commandFileHandler.stat()).size;
    const buff = Buffer.alloc(size);
    await commandFileHandler.read(buff, 0, size, 0);
    const command = buff.toString("utf-8").trim();

    await initializeHTMLFile();

    // Parse command to determine which section to add
    if (command.startsWith(CREATE_BUTTON)) {
      const color = command.split(" ").slice(2).join(" ") || "green";
      await appendButtonToHTML(color);
    } else if (command === CREATE_NAVBAR) {
      await appendNavbarToHTML();
    } else if (command === CREATE_BANNER) {
      await appendBannerToHTML();
    } else if (command === CREATE_SIDEMENU) {
      await appendSideMenuToHTML();
    } else if (command === CREATE_ABOUT) {
      await appendAboutSection();
    } else if (command === CREATE_BLOG) {
      await appendBlogSection();
    } else if (command === CREATE_CONTACT) {
      await appendContactSection();
    } else if (command === CREATE_HEADER) {
      await appendHeaderToHTML();
    } else if (command === CREATE_FOOTER) {
      await appendFooterToHTML();
    }
  });

  const watcher = fs.watch("./command.txt");
  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();