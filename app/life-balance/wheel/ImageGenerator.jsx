import html2canvas from "html2canvas";
import { toJpeg } from "html-to-image";

import { toast } from "sonner";

/**
 * Generates and downloads a shareable image of the user's balance wheel
 *
 * @param {HTMLElement} wheelElement - Reference to the balance wheel DOM element
 * @param {string} date - The current date string to display on the image
 */
export const generateBalanceWheelImage = async (wheelElement, date) => {
  if (!wheelElement) {
    console.error("Wheel element reference is missing");
    toast.error(
      "Unable to download: Wheel element not found. Please try again.",
    );
    return;
  }

  try {
    const elements = wheelElement.querySelectorAll('[class*="bg-"]');
    const originalClasses = new Map();
    elements.forEach((el) => {
      originalClasses.set(el, el.getAttribute("class"));
      const classList = el.getAttribute("class").split(" ");
      const filteredClasses = classList.filter(
        (cls) => !cls.includes("oklch") && !cls.includes("bg-gradient"),
      );
      el.setAttribute("class", filteredClasses.join(" "));
    });

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const wheelSize = isMobile ? screenWidth - 40 : 740;

    const cardContainer = document.createElement("div");
    cardContainer.id = "wheel-card-container";
    cardContainer.style.width = isMobile ? "100vw" : "800px";
    cardContainer.style.height = isMobile ? "auto" : "1200px";
    cardContainer.style.background =
      "linear-gradient(180deg, #205A6A 0%, #002A36 100%)";
    cardContainer.style.borderRadius = "20px";
    cardContainer.style.padding = isMobile ? "30px" : "60px";
    cardContainer.style.display = "flex";
    cardContainer.style.flexDirection = "column";
    cardContainer.style.color = "white";
    cardContainer.style.fontFamily =
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif, general-sans";
    cardContainer.style.boxSizing = "border-box";
    cardContainer.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
    cardContainer.style.position = "fixed";
    cardContainer.style.zIndex = "-9999";
    cardContainer.style.top = "0";
    cardContainer.style.left = "0";
    cardContainer.style.transform = "scale(1)";
    cardContainer.style.transformOrigin = "top left";

    const formattedDate = date.split("/").reverse().join("/");

    const wheelWrapper = document.createElement("div");
    wheelWrapper.style.position = "relative";
    wheelWrapper.style.width = `${wheelSize}px`;
    wheelWrapper.style.height = `${wheelSize}px`;
    wheelWrapper.style.margin = "0 auto 40px";
    wheelWrapper.style.display = "flex";
    wheelWrapper.style.justifyContent = "center";
    wheelWrapper.style.alignItems = "center";
    cardContainer.appendChild(wheelWrapper);

    const wheelContainer = document.createElement("div");
    wheelContainer.style.position = "absolute";
    wheelContainer.style.width = `${wheelSize}px`;
    wheelContainer.style.height = `${wheelSize}px`;
    wheelContainer.style.top = "0";
    wheelContainer.style.left = "0";
    wheelContainer.style.right = "0";
    wheelContainer.style.margin = "0 auto";
    wheelContainer.style.zIndex = "2";
    wheelContainer.setAttribute("data-wheel-container", "true");
    wheelWrapper.appendChild(wheelContainer);

    const titleContainer = document.createElement("div");
    titleContainer.style.marginBottom = "30px";
    cardContainer.appendChild(titleContainer);

    const title = document.createElement("h1");
    title.style.fontSize = isMobile ? "32px" : "48px";
    title.style.fontWeight = "600";
    title.style.margin = "0";
    title.style.letterSpacing = "-0.5px";
    title.textContent = "Your Life Balance Wheel";
    titleContainer.appendChild(title);

    const dateDiv = document.createElement("h2");
    dateDiv.style.fontSize = isMobile ? "20px" : "32px";
    dateDiv.style.fontWeight = "normal";
    dateDiv.style.margin = "10px 0 0 0";
    dateDiv.style.fontStyle = "italic";
    dateDiv.textContent = `On ${formattedDate}`;
    titleContainer.appendChild(dateDiv);

    const description = document.createElement("p");
    description.style.fontSize = isMobile ? "16px" : "22px";
    description.style.lineHeight = "1.6";
    description.style.marginBottom = "30px";
    description.style.maxWidth = "90%";
    description.style.opacity = "0.9";
    description.textContent =
      "This Is How Your Life Balance Wheel Looks Like Now. Scores Will Change Weekly, Daily, Even Hourly As Circumstances Change. Do Not Look For Any Ultimate Truth, Just Check In With How You Feel In This Moment.";
    cardContainer.appendChild(description);

    document.body.appendChild(cardContainer);

    if (wheelElement) {
      const wheelParent = wheelElement.closest('[data-wheel-container="true"]');
      const wheelClone = (wheelParent || wheelElement).cloneNode(true);
      wheelClone.style.position = "absolute";
      wheelClone.style.top = "0";
      wheelClone.style.left = "0";
      wheelClone.style.right = "0";
      wheelClone.style.margin = "0 auto";
      wheelClone.style.width = "100%";
      wheelClone.style.height = "100%";
      wheelContainer.appendChild(wheelClone);
    }

    const canvas = await html2canvas(cardContainer, {
      backgroundColor: "transparent",
      useCORS: true,
      scale: 2,
      allowTaint: true,
      foreignObjectRendering: true,
      onclone: (clonedDoc, element) => {
        element.style.zIndex = "auto";
        element.style.transform = "none";
        element.style.top = "0";
        element.style.left = "0";
        element.style.position = "absolute";

        const allElements = clonedDoc.querySelectorAll("*");
        allElements.forEach((el) => {
          const computedStyle = window.getComputedStyle(el);
          const backgroundColor = computedStyle.backgroundColor;
          if (backgroundColor && backgroundColor.includes("oklch")) {
            el.style.backgroundColor = "#19667A";
          }
        });
      },
    });

    const imageData = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.download = "life-balance-wheel.jpg";
    link.href = imageData;

    // Add the link to the document and trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Restore original classes
    elements.forEach((el) => {
      if (originalClasses.has(el)) {
        el.setAttribute("class", originalClasses.get(el));
      }
    });
  } catch (err) {
    console.error("Error generating card image:", err);

    // Fallback to simpler download method

    try {
      if (wheelElement) {
        const dataUrl = await toJpeg(wheelElement, { quality: 0.95 });
        const link = document.createElement("a");
        link.download = "balance-wheel.jpeg";
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error("No wheel element available for fallback");
      }
    } catch (fallbackErr) {
      console.error("Fallback download also failed:", fallbackErr);
      toast.error(
        "Download failed. Please try again or contact support if the issue persists.",
      );
    }
  } finally {
    // Clean up the temporary card container
    const existingCard = document.querySelector("#wheel-card-container");
    if (existingCard) {
      existingCard.remove();
    }
  }
};
