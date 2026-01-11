"use client";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Popup from "./Popup";
import styles from "./DeskDrawing.module.css";

const DeskDrawing = () => {
  const [svgContent, setSvgContent] = useState(() => null);
  const [popup, setPopup] = useState(null);
  const svgContainerRef = useRef(null);
  const transformRef = useRef(null);
  const [naturalSize, setNaturalSize] = useState(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [initialTransform, setInitialTransform] = useState(null);
  const [transformKey, setTransformKey] = useState("initial");

  // Load SVG file
  useEffect(() => {
    fetch("/assets/maindesk.svg")
      .then((res) => res.text())
      .then((text) => setSvgContent(text));
  }, []);

  // Calculate SVG dimensions
  useEffect(() => {
    if (!svgContent) return;
    const container = svgContainerRef.current;
    if (!container) return;
    const svgEl = container.querySelector("svg");
    if (!svgEl) return;

    let w;
    let h;
    const vb = svgEl.getAttribute("viewBox");
    if (vb) {
      const parts = vb.trim().split(/\s+/).map(parseFloat);
      if (parts.length === 4 && parts.every((n) => !Number.isNaN(n))) {
        w = parts[2];
        h = parts[3];
      }
    }
    if ((!w || !h) && typeof svgEl.getBBox === "function") {
      try {
        const bbox = svgEl.getBBox();
        if (bbox?.width && bbox?.height) {
          w = bbox.width;
          h = bbox.height;
        }
      } catch (_) {}
    }
    if (!w || !h) {
      const aw = parseFloat(svgEl.getAttribute("width"));
      const ah = parseFloat(svgEl.getAttribute("height"));
      if (!Number.isNaN(aw) && !Number.isNaN(ah)) {
        w = aw;
        h = ah;
      }
    }
    if (!w || !h) {
      w = 3840;
      h = 2160;
    }

    setNaturalSize((prev) => {
      if (prev && prev.w === w && prev.h === h) return prev;
      return { w, h };
    });
  }, [svgContent]);

  // Calculate initial zoom and position
  useEffect(() => {
    if (!naturalSize) return;
    if (typeof window === "undefined") return;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    if (!ww || !wh) return;
    const { w, h } = naturalSize;
    
    // Adjust this multiplier to change initial zoom level
    // Higher = more zoomed in, Lower = more zoomed out
    const scale = Math.min(ww / w, wh / h) * 0.9;
    const x = (ww - w * scale) / 2;
    const y = (wh - h * scale) / 2;

    setInitialTransform((prev) => {
      if (prev && prev.scale === scale && prev.x === x && prev.y === y) {
        return prev;
      }
      return { scale, x, y };
    });

    const nextKey = `${scale.toFixed(4)}-${x.toFixed(1)}-${y.toFixed(1)}`;
    if (transformKey !== nextKey) {
      setViewerReady(false);
      setTransformKey(nextKey);
    }
  }, [naturalSize, transformKey]);

  // Popup content for each interactive element
  // Customize this section with your own content!
  const popupsData = useMemo(
    () => ({
      resume: {
        content: (
          <>
            <p>
              This is my resume! Download it to learn more about my experience and skills.
            </p>
            <a
              href="/assets/your-resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Resume
            </a>
          </>
        ),
      },
      studentid: {
        content: (
          <>
            <p>
              I'm a computer science student passionate about creating 
              interactive experiences and solving problems through code.
            </p>
            <p>
              <strong>Interests:</strong> Web Development, UI/UX Design, Creative Coding
            </p>
          </>
        ),
      },
      camera: {
        content: (
          <>
            <p>
              I love photography and capturing moments! This camera represents 
              my creative side beyond coding.
            </p>
            <p>Check out my photography on Instagram!</p>
          </>
        ),
      },
      projects: {
        content: (
          <>
            <h3>My Projects</h3>
            <p>
              I've built various web applications, games, and tools. 
              Click on my laptop screen to explore more!
            </p>
            <p>
              <a
                href="https://github.com/YOUR_USERNAME"
                target="_blank"
                rel="noopener noreferrer"
              >
                View My GitHub
              </a>
            </p>
          </>
        ),
      },
      skills: {
        content: (
          <>
            <h3>Technical Skills</h3>
            <p><strong>Languages:</strong> JavaScript, Python, Java, C++</p>
            <p><strong>Frameworks:</strong> React, Next.js, Node.js</p>
            <p><strong>Tools:</strong> Git, VS Code, Figma</p>
          </>
        ),
      },
      sketchbook: {
        content: (
          <>
            <p>
              I enjoy sketching and drawing in my free time. Art and code 
              complement each other beautifully!
            </p>
            <p>This website itself started as a sketch in this very book.</p>
          </>
        ),
      },
      phone: {
        content: (
          <>
            <p>Always connected and ready to collaborate on new projects!</p>
            <p>Feel free to reach out via email or LinkedIn.</p>
          </>
        ),
      },
      laptop: {
        content: (
          <>
            <h3>My Workspace</h3>
            <p>
              This is where the magic happens! I spend countless hours here 
              coding, learning, and building cool stuff.
            </p>
            <p>Current project: This interactive portfolio!</p>
          </>
        ),
      },
      cat: {
        content: (
          <>
            <p>
              Meet my coding companion! Every developer needs a furry friend 
              to keep them company during late-night debugging sessions.
            </p>
            <p>🐱 Meow!</p>
          </>
        ),
      },
      table: {
        content: (
          <>
            <p>
              This is my desk where all the creativity and coding happens!
              Click on the different items to learn more about me.
            </p>
          </>
        ),
      },
    }),
    []
  );

  // Handle clicks on interactive elements
  const handleSvgClick = useCallback(
    (e) => {
      const target = e.target.closest("g[id]");
      if (!target) return;

      const id = target.id;

      // Show popup for elements with content
      if (popupsData[id]) {
        setPopup({
          content: popupsData[id].content,
          x: e.clientX,
          y: e.clientY,
        });
      } 
      // Handle external links
      // Customize these URLs with your own!
      else if (id === "resume") {
        window.open("/assets/your-resume.pdf", "_blank");
      } else if (id === "projects") {
        window.open("https://github.com/YOUR_USERNAME", "_blank");
      } else if (id === "studentid") {
        window.open("https://www.linkedin.com/in/YOUR_PROFILE/", "_blank");
      }
    },
    [popupsData]
  );

  const handleClosePopup = () => {
    setPopup(null);
  };

  // Center and fit SVG to viewport
  const fitAndCenter = useCallback(() => {
    const apiMaybe = transformRef.current;
    const api = apiMaybe?.instance ?? apiMaybe;
    if (!api || !naturalSize) return;
    const wrapper = api.wrapperComponent;
    if (!wrapper && typeof window === "undefined") return;
    const ww = wrapper?.clientWidth || window.innerWidth;
    const wh = wrapper?.clientHeight || window.innerHeight;
    const { w, h } = naturalSize;
    if (!ww || !wh || !w || !h) return;
    const scale = Math.min(ww / w, wh / h) * 0.9;
    if (typeof api.centerView === "function") {
      api.centerView(scale, 0);
      return;
    }
    const x = (ww - w * scale) / 2;
    const y = (wh - h * scale) / 2;
    if (typeof api.setTransform === "function") {
      api.setTransform(x, y, scale, 0);
    }
  }, [naturalSize]);

  // Recenter after SVG loads
  useEffect(() => {
    if (!viewerReady || !svgContent || !naturalSize) return;
    const id = requestAnimationFrame(() => {
      fitAndCenter();
    });
    return () => cancelAnimationFrame(id);
  }, [svgContent, naturalSize, fitAndCenter, viewerReady]);

  // Recenter on window resize
  useEffect(() => {
    if (!viewerReady) return;
    const onResize = () => fitAndCenter();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fitAndCenter, viewerReady]);

  // Add hover effects
  useEffect(() => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer) return;

    const handleMouseOver = (e) => {
      const target = e.target.closest("g[id]");
      if (
        target &&
        (popupsData[target.id] ||
          ["resume", "projects", "studentid"].includes(target.id))
      ) {
        target.style.cursor = "pointer";
        target.style.transition =
          "transform 0.2s ease-in-out, filter 0.2s ease-in-out";
        target.style.transform = "translateY(-2px)";
        target.style.filter = "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))";

        // Change stroke color on hover
        const paths = target.querySelectorAll("path, circle, rect, line, polygon");
        paths.forEach((el) => {
          const originalStroke = el.getAttribute("stroke");
          if (originalStroke) {
            el.setAttribute("data-original-stroke", originalStroke);
          }
          el.setAttribute("stroke", "#4287f5");
        });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest("g[id]");
      if (target) {
        target.style.transform = "";
        target.style.filter = "";

        // Restore original stroke color
        const paths = target.querySelectorAll("path, circle, rect, line, polygon");
        paths.forEach((el) => {
          const originalStroke = el.getAttribute("data-original-stroke");
          if (originalStroke) {
            el.setAttribute("stroke", originalStroke);
            el.removeAttribute("data-original-stroke");
          }
        });
      }
    };

    svgContainer.addEventListener("mouseover", handleMouseOver);
    svgContainer.addEventListener("mouseout", handleMouseOut);
    svgContainer.addEventListener("click", handleSvgClick);

    return () => {
      svgContainer.removeEventListener("mouseover", handleMouseOver);
      svgContainer.removeEventListener("mouseout", handleMouseOut);
      svgContainer.removeEventListener("click", handleSvgClick);
    };
  }, [svgContent, handleSvgClick, popupsData, transformKey]);

  // Add invisible bounding boxes for better click detection
  useEffect(() => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer || !svgContent) return;

    const interactiveIds = [
      ...Object.keys(popupsData),
      "resume",
      "projects",
      "studentid",
    ];

    const ensureBoundingBoxes = () => {
      interactiveIds.forEach((id) => {
        const group = svgContainer.querySelector(`#${id}`);
        if (!group) return;

        let rect = group.querySelector(".bbox");
        if (!rect) {
          const bbox = group.getBBox();
          rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.classList.add("bbox");
          rect.setAttribute("fill", "transparent");
          rect.style.pointerEvents = "all";
          group.insertBefore(rect, group.firstChild);
        }
        const bbox = group.getBBox();
        rect.setAttribute("x", bbox.x);
        rect.setAttribute("y", bbox.y);
        rect.setAttribute("width", bbox.width);
        rect.setAttribute("height", bbox.height);
      });
    };

    ensureBoundingBoxes();
    const rafId = requestAnimationFrame(ensureBoundingBoxes);
    return () => cancelAnimationFrame(rafId);
  }, [svgContent, popup, popupsData, transformKey, viewerReady]);

  return (
    <div className={styles.container}>
      {/* Change this to your name! */}
      <div className={styles.fixedTitle}>simone ghosh</div>
      
      <TransformWrapper
        key={transformKey}
        ref={transformRef}
        onInit={(ref) => {
          transformRef.current = ref?.instance ?? ref;
          setViewerReady(true);
          requestAnimationFrame(() => fitAndCenter());
        }}
        initialScale={initialTransform?.scale ?? 1}
        initialPositionX={initialTransform?.x ?? 0}
        initialPositionY={initialTransform?.y ?? 0}
        centerOnInit
        limitToBounds
        minScale={0.05}
        maxScale={20}
      >
        <TransformComponent>
          <div
            ref={svgContainerRef}
            className={styles.svgContainer}
            dangerouslySetInnerHTML={{ __html: svgContent || "" }}
          />
        </TransformComponent>
      </TransformWrapper>
      
      {popup && (
        <Popup
          content={popup.content}
          onClose={handleClosePopup}
          x={popup.x}
          y={popup.y}
        />
      )}
    </div>
  );
};

export default DeskDrawing;