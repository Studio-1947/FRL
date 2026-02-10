/**
 * generateBalanceWheelImage.js
 * Builds a branded "card" (title + date + description + your wheel) in memory,
 * rasterizes it with html2canvas, then downloads a high-res JPEG.
 *
 * Usage:
 *   const el = graphRef.current; // from BalanceWheel
 *   await generateBalanceWheelImage(el, "18/09/2025"); // dd/mm/yyyy
 */

// import html2canvas from "html2canvas";
// import { toJpeg } from "html-to-image";

/**
 * Generates and downloads a shareable image of the user's balance wheel
 *
 * @param {HTMLElement} wheelElement Reference to the wheel container (the node with data-balance-wheel / graphRef.current)
 * @param {string} date A date string in "dd/mm/yyyy" (or any string you prefer for the subtitle)
 */
export const generateBalanceWheelImage = async (wheelElement, date) => {
  console.log("generateBalanceWheelImage called with:", { wheelElement, date });

  const [{ default: html2canvas }, { toJpeg }] = await Promise.all([
    import("html2canvas"),
    import("html-to-image"),
  ]);

  if (!wheelElement) {
    console.error("Wheel element reference is missing");
    alert("Unable to download: Wheel element not found. Please try again.");
    return;
  }

  try {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const wheelSize = isMobile ? screenWidth - 40 : 740;

    // --- Card container (off-screen) ---
    const card = document.createElement("div");
    card.id = "wheel-card-container";
    card.style.width = isMobile ? "100vw" : "800px";
    card.style.height = isMobile ? "auto" : "1200px";
    card.style.background = "linear-gradient(180deg, #205A6A 0%, #002A36 100%)";
    card.style.borderRadius = "20px";
    card.style.padding = isMobile ? "30px" : "60px";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.color = "white";
    card.style.fontFamily =
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif, general-sans";
    card.style.boxSizing = "border-box";
    card.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";
    card.style.position = "fixed";
    card.style.zIndex = "-9999";
    card.style.top = "0";
    card.style.left = "0";
    card.style.transform = "scale(1)";
    card.style.transformOrigin = "top left";

    // Title + date
    const titleWrap = document.createElement("div");
    titleWrap.style.marginBottom = "30px";
    card.appendChild(titleWrap);

    const title = document.createElement("h1");
    title.style.fontSize = isMobile ? "32px" : "48px";
    title.style.fontWeight = "600";
    title.style.margin = "0";
    title.style.letterSpacing = "-0.5px";
    title.textContent = "Your Life Balance Wheel";
    titleWrap.appendChild(title);

    const dateEl = document.createElement("h2");
    dateEl.style.fontSize = isMobile ? "20px" : "32px";
    dateEl.style.fontWeight = "normal";
    dateEl.style.margin = "10px 0 0 0";
    dateEl.style.fontStyle = "italic";

    // Optional: normalize dd/mm/yyyy -> yyyy/mm/dd presentation
    const formattedDate =
      typeof date === "string" && date.includes("/")
        ? date.split("/").reverse().join("/")
        : date;

    dateEl.textContent = `On ${formattedDate}`;
    titleWrap.appendChild(dateEl);

    // Description
    const desc = document.createElement("p");
    desc.style.fontSize = isMobile ? "16px" : "22px";
    desc.style.lineHeight = "1.6";
    desc.style.marginBottom = "30px";
    desc.style.maxWidth = "90%";
    desc.style.opacity = "0.9";
    desc.textContent =
      "This is how your Life Balance Wheel looks right now. Scores change over time—check in with how you feel in this moment.";
    card.appendChild(desc);

    // Wheel frame
    const wheelFrame = document.createElement("div");
    wheelFrame.style.position = "relative";
    wheelFrame.style.width = `${wheelSize}px`;
    wheelFrame.style.height = `${wheelSize}px`;
    wheelFrame.style.margin = "0 auto 40px";
    wheelFrame.style.display = "flex";
    wheelFrame.style.justifyContent = "center";
    wheelFrame.style.alignItems = "center";
    card.appendChild(wheelFrame);

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
    wheelFrame.appendChild(wheelContainer);

    // Append the card to DOM (off-screen) before cloning
    document.body.appendChild(card);

    // Clone the wheel node (we copy the parent that contains the responsive sizing)
    const parentWithAttr = wheelElement.closest(
      '[data-wheel-container="true"]',
    );
    const clone = (parentWithAttr || wheelElement).cloneNode(true);
    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.right = "0";
    clone.style.margin = "0 auto";
    clone.style.width = "100%";
    clone.style.height = "100%";
    wheelContainer.appendChild(clone);

    // Render to canvas with error handling for CSS issues
    const canvas = await html2canvas(card, {
      backgroundColor: "#205A6A",
      useCORS: true,
      scale: 2,
      allowTaint: true,
      foreignObjectRendering: false, // Disable to avoid CSS parsing issues
      logging: false, // Suppress console warnings
      ignoreElements: (element) => {
        // Skip elements that might cause CSS parsing issues
        if (element.tagName === "STYLE" || element.tagName === "LINK") {
          return false;
        }
        return false;
      },
      onclone: (clonedDoc, element) => {
        // Ensure proper positioning in the cloned DOM
        element.style.zIndex = "auto";
        element.style.transform = "none";
        element.style.top = "0";
        element.style.left = "0";
        element.style.position = "absolute";

        // Remove any problematic CSS that uses lab() or other unsupported functions
        const allElements = element.querySelectorAll("*");
        allElements.forEach((el) => {
          const computedStyle = window.getComputedStyle(el);
          // Reset any potentially problematic styles
          if (el.style) {
            // Keep only safe, standard CSS properties
            const safeStyles = {
              color: computedStyle.color,
              backgroundColor: computedStyle.backgroundColor,
              fontSize: computedStyle.fontSize,
              fontWeight: computedStyle.fontWeight,
              padding: computedStyle.padding,
              margin: computedStyle.margin,
            };
            // Clear and reapply only safe styles
            Object.keys(safeStyles).forEach((prop) => {
              const value = safeStyles[prop];
              // Skip lab() or other unsupported color functions
              if (value && !value.includes("lab(") && !value.includes("lch(")) {
                el.style[prop] = value;
              }
            });
          }
        });
      },
    });

    // Download
    const imageData = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.download = "life-balance-wheel.jpg";
    link.href = imageData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Download successful!");
  } catch (err) {
    console.error("Error generating card image:", err);

    // Fallback: capture only the wheel element with safer options
    try {
      console.log("Attempting fallback download method...");
      const dataUrl = await toJpeg(wheelElement, {
        quality: 0.95,
        skipFonts: true, // Skip font embedding to avoid CSS rules errors
        cacheBust: true,
        backgroundColor: "#1A4A5C",
      });
      const link = document.createElement("a");
      link.download = "balance-wheel.jpeg";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("Fallback download successful!");
    } catch (fallbackErr) {
      console.error("Fallback download also failed:", fallbackErr);
      alert(
        "Download failed due to browser restrictions. Please try taking a screenshot instead.",
      );
    }
  } finally {
    // Cleanup the temporary card
    document.querySelector("#wheel-card-container")?.remove();
  }
};
