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
  const [naturalSize, setNaturalSize] = useState(null); // { w, h }
  const [viewerReady, setViewerReady] = useState(false);
  const [initialTransform, setInitialTransform] = useState(null);
  const [transformKey, setTransformKey] = useState("initial");

  useEffect(() => {
    fetch("/assets/main.svg")
      .then((res) => res.text())
      .then((text) => setSvgContent(text));
  }, []);

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
      } catch (_) {
        // ignore getBBox errors (e.g., if svg not rendered yet)
      }
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
      if (prev && prev.w === w && prev.h === h) {
        return prev;
      }
      return { w, h };
    });
  }, [svgContent]);

  useEffect(() => {
    if (!naturalSize) return;
    if (typeof window === "undefined") return;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    if (!ww || !wh) return;
    const { w, h } = naturalSize;
    const scale = Math.min(ww / w, wh / h);
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

  const popupsData = useMemo(
    () => ({
        
        Me: {
        content:
          <>
          <h3>Hi, I'm Simone!</h3>
          <img
            src="/assets/portrait.jpg"
            alt="Simone Ghosh"
            style={{ 
              width: "200%", 
              maxWidth: "200px",
              height: "auto", 
              borderRadius: "8px",
              margin: "10px 0"
            }}
          />
          <p>
            I'm a first-year Systems Design Engineering student at the University of Waterloo, 
            passionate about building innovative software solutions that make a real impact.
          </p>
          <p>
            When I'm not coding, you'll find me running around campus, ice skating at RIM Park, 
            getting lost in a good book, or sketching in my notebook. I love combining my 
            technical skills with creative thinking to solve complex problems.
          </p>
          <p>
            I'm currently exploring opportunities in software engineering where I can apply my 
            passion for development and continuous learning!
          </p>
        </>,
        },

        Cat: {
        content:
          <>
          <h3>Meet My Coding Companion!</h3>
          <img
            src="/assets/cat.jpg"
            alt="My cat"
            style={{ 
              width: "500%", 
              maxWidth: "550px",
              height: "auto", 
              borderRadius: "8px",
              margin: "10px 0"
            }}
          />
          <p>
            This is my adorable cat, Clark, whom I adopted from the Toronto Humane Society. 
            He's super cute and full of personality, always brightening my day. Clark can do 
            some amazing tricks he can sit, give a high five, and even stand on his hind legs! 
            He's the perfect companion, making every moment a little more fun.
          </p>
          </>,
        },

        Laptop: {
        content:
          <>
          <h3>My Projects & Experience</h3>
          
          <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
            Current Position: Web Developer @ Generis
          </h4>
          <p>
            I'm currently working as a web developer at Generis, where I manage 24 client websites, 
            develop an AI-powered chatbot to enhance customer engagement, and implement machine 
            learning solutions to automate repetitive tasks and improve workflow efficiency.
          </p>

          <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
            Notes App - Full-Stack MERN Application
          </h4>
          <p>
            Developed a responsive note-taking web application using the MERN stack (MongoDB, 
            Express, React, Node.js). This project demonstrates my ability to build complete 
            full-stack solutions from database design to user interface.
          </p>
          <p>
            I designed and deployed RESTful APIs enabling secure CRUD operations, implementing 
            authentication and authorization to protect user data. By integrating Axios for 
            asynchronous data handling, I reduced client-server latency by 20%, significantly 
            improving the user experience.
          </p>
          <p>
            This project strengthened my skills in database modeling, API design, state management 
            in React, and optimizing network performance for web applications.
          </p>
          <p>
            <a
              href="https://github.com/SimoneGhosh/Notes-App"
              target="_blank"
              rel="noopener noreferrer"
            >
              View project on GitHub →
            </a>
          </p>

          <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
            Interpreter in Go – Systems Programming
          </h4>
          <p>
            Implemented a full interpreter for the Monkey programming language in Go, building 
            every component from scratch including the lexer, parser, and Abstract Syntax Tree (AST).
          </p>
          <p>
            This deep dive into compiler design taught me how programming languages work under 
            the hood. I applied compiler-design principles to optimize recursive evaluation and 
            improve memory efficiency, gaining hands-on experience with low-level systems programming.
          </p>
          <p>
            Working in Go gave me valuable experience with a statically-typed, compiled language 
            and deepened my understanding of language implementation, parsing algorithms, and 
            performance optimization.
          </p>
          <p>
            <a
              href="https://github.com/SimoneGhosh/Monkey"
              target="_blank"
              rel="noopener noreferrer"
            >
              View project on GitHub →
            </a>
          </p>

          <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
            Geometry Dash Recreation
          </h4>
          <p>
            My journey into programming started with this project—a Java-based recreation of 
            Geometry Dash. I built the game mechanics from scratch, including collision detection, 
            physics simulation, and level progression systems.
          </p>
          <p>
            This project taught me fundamental programming concepts like object-oriented design, 
            event handling, and game loop optimization. It was challenging but incredibly 
            rewarding to see everything come together into a playable game!
          </p>
          <p>
            <a
              href="https://github.com/SimoneGhosh/Pygame"
              target="_blank"
              rel="noopener noreferrer"
            >
              View project on GitHub →
            </a>
          </p>

          <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
            This Portfolio Website
          </h4>
          <p>
            This website itself is a project I'm proud of! I wanted to showcase my work in a 
            creative and interactive way, so I hand-drew this desk scene and brought it to life 
            using Next.js and React.
          </p>
          <p>
            The SVG-based navigation with zoom and pan functionality creates an engaging user 
            experience that reflects both my technical and artistic sides. It's built with 
            modern web technologies and optimized for performance.
          </p>
          </>,
        },

        Sketchbook: {
        content:
          <>
           <h3>Sketches & Ideas</h3>
          <img
            src="/assets/sketchbook.jpg"
            alt="Sketchbook page"
            style={{ 
              width: "500%", 
              maxWidth: "550px",
              height: "auto", 
              border: "2px solid #000",
              margin: "10px 0"
            }}
          />
          <p>
            Drawing has always been a creative outlet for me. I love sketching UI concepts, 
            wireframing project ideas, and just doodling when I need to think through a problem 
            differently.
          </p>
          <p>
            This sketchbook is where many of my projects start—including this very portfolio 
            website! I find that putting pen to paper helps me visualize solutions before I 
            start coding them.
          </p>
          </>,
        },

        Camera: {
        content:
          <>
          <h3>Capturing Moments</h3>
          <img
            src="/assets/oweekphoto.jpeg"
            alt="O-Week purpling"
            style={{ 
              width: "500%", 
              maxWidth: "550px",
              height: "auto", 
              borderRadius: "8px",
              margin: "10px 0"
            }}
          />
          <p>
            This is my dad's old digital camera, and it's become my favorite way to document 
            university life. There's something special about using a physical camera instead of 
            just my phone—it makes me more intentional about the moments I capture.
          </p>
          <p>
            From O-Week purpling (pictured above) to spontaneous adventures around Waterloo, 
            this camera has documented some amazing memories from my first year.
          </p>
          <p>
            <a
              href="https://ca.pinterest.com/iamnehaaa/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Check out more of my photography on Pinterest →
            </a>
          </p>
          </>,
        },
    }),
    []
  );

  const handleSvgClick = useCallback(
    (e) => {
      const target = e.target.closest("g[id]");
      if (!target) return;

      const id = target.id;

      if (popupsData[id]) {
        setPopup({
          content: popupsData[id].content,
          x: e.clientX,
          y: e.clientY,
        });
      } else if (id === "Resume") {
        window.open("/assets/resume.pdf", "_blank");
      } else if (id === "Github") {
        window.open("https://github.com/SimoneGhosh", "_blank");
      } else if (id === "Linkedin") {
        window.open("https://www.linkedin.com/in/simoneghosh/", "_blank");
      }
    },
    [popupsData]
  );

  const handleClosePopup = () => {
    setPopup(null);
  };

  const fitAndCenter = useCallback(() => {
    const apiMaybe = transformRef.current;
    const api = apiMaybe?.instance ?? apiMaybe; // support v3/v4 shapes
    if (!api || !naturalSize) return;
    const wrapper = api.wrapperComponent;
    if (!wrapper && typeof window === "undefined") return;
    const ww = wrapper?.clientWidth || window.innerWidth;
    const wh = wrapper?.clientHeight || window.innerHeight;
    const { w, h } = naturalSize;
    if (!ww || !wh || !w || !h) return;
    const scale = Math.min(ww / w, wh / h);
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

  // Recenter after SVG content is injected
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

  useEffect(() => {
  const svgContainer = svgContainerRef.current;
  if (!svgContainer) return;

  const handleMouseOver = (e) => {
  // Only trigger on the actual target group, not child elements
  if (e.target.tagName.toLowerCase() === 'svg') return;
  
  const target = e.target.closest("g[id]");
  if (!target) return;
  
  // Check if this is an interactive element
  if (
    !popupsData[target.id] &&
    !["Resume", "Github", "Linkedin"].includes(target.id)
  ) {
    return;
  }

  // Apply hover styles (no color change)
  target.style.cursor = "pointer";
  target.style.transition = "transform 0.2s ease-in-out, filter 0.2s ease-in-out";
  target.style.transform = "translateY(-2px)";
  target.style.filter = "drop-shadow(2px 2px 3px rgb(0 0 0 / 0.3))";
    // Change stroke color
    
  };

  const handleMouseOut = (e) => {
    // Only trigger when actually leaving the group
    if (e.target.tagName.toLowerCase() === 'svg') return;
    
    const target = e.target.closest("g[id]");
    if (!target) return;

    // Remove hover styles
    target.style.transform = "";
    target.style.filter = "";
    target.style.cursor = "";

    // Restore original stroke colors
    const elements = target.querySelectorAll("path, circle, rect, line, polygon, ellipse, polyline");
    elements.forEach((el) => {
      const originalStroke = el.getAttribute("data-original-stroke");
      if (originalStroke) {
        el.setAttribute("stroke", originalStroke);
        el.removeAttribute("data-original-stroke");
      }
    });
  };

  // Use capturing phase for better event handling
  svgContainer.addEventListener("mouseover", handleMouseOver, true);
  svgContainer.addEventListener("mouseout", handleMouseOut, true);
  svgContainer.addEventListener("click", handleSvgClick);

  return () => {
    svgContainer.removeEventListener("mouseover", handleMouseOver, true);
    svgContainer.removeEventListener("mouseout", handleMouseOut, true);
    svgContainer.removeEventListener("click", handleSvgClick);
  };
}, [svgContent, handleSvgClick, popupsData, transformKey]);

  useEffect(() => {
    const svgContainer = svgContainerRef.current;
    if (!svgContainer || !svgContent) return;

    const interactiveIds = [
      ...Object.keys(popupsData),
      "Resume",
      "Github",
      "Linkedin",
    ];

    const ensureBoundingBoxes = () => {
      interactiveIds.forEach((id) => {
        const group = svgContainer.querySelector(`#${id}`);
        if (!group) return;

        let rect = group.querySelector(".bbox");
        if (!rect) {
          const bbox = group.getBBox();
          rect = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
          );
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
      <div className={styles.fixedTitle}>
        <img 
            src="/assets/name-logo.svg" 
            alt="Simone Ghosh" 
            style={{ height: 'auto', width: '100%', maxWidth: "1000px", }}
        />
        </div>
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