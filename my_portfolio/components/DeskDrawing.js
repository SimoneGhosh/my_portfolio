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

      Interface: {
        content: (
          <>
            I love making music in my spare time! This is my audio interface
            that I use when I record. Check out my music{" "}
            <a
              href="https://www.instagram.com/mnjnmsc"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram page
            </a>
            !
          </>
        ),
      },
      "DE1SOC": {
        content:
          <>In computer engineering, we&apos;re currently learning about low level digital systems so I use the DE1-SoC quite often. It&apos;s been lots of fun learning about the foundational building blocks of computers!</>,
      },
      PC: {
        content:
          <>This is my PC that I built five years ago - it has a RTX 2080Ti and i7-8700K. I use it for school, content, music, and video games.</>,
      },
      Kbd: {
        content: (
          <>
            This is my keyboard - I&apos;m planning on building my own Hall Effect keyboard soon, I just need to stop spending so much money... {" "}
            <a
              href="https://monkeytype.com/profile/frostic1393"
              target="_blank"
              rel="noopener noreferrer"
            >
              my monkeytype profile
            </a>
          </>
        ),
      },
      Mouse: {
        content: (
          <>
            This is my Logitech G Pro Superlight, the perfect mouse in my opinion. I used
            it to hit my peak rank in Valorant, Ascendant 2. Someday I&apos;ll hit radiant right? Surely...{" "}
            <br></br>
            <a
              href="https://tracker.gg/valorant/profile/riot/chuchubluu%23pika/overview?platform=pc&playlist=competitive"
              target="_blank"
              rel="noopener noreferrer"
            >
              Valorant Tracker
            </a>
          </>
        ),
      },
      "Mango": {
        content: (
          <>
            <p>
              In 24 hours at HelloHacks 2025, my team and I built Mango, a
              full-body gesture control system that lets you play Minecraft
              using just your webcam. No sensors, no VR headset, just movement.
              We wanted to make immersive gaming more accessible and open to
              everyone.
            </p>
            <p>
              Mango uses MediaPipe Holistic and OpenCV to track over 500 body
              landmarks, while NumPy and PyAutoGUI translate those movements
              into real-time keyboard and mouse inputs. Walking, hitting,
              mining, placing, shielding — you can control it with your body.
            </p>
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/pdja2_o8bpY"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p>
              <a
                href="https://devpost.com/software/mango-full-body-gesture-control-for-any-game"
                target="_blank"
                rel="noopener noreferrer"
              >
                Devpost
              </a>
            </p>
          </>
        ),
      },
      "Ubc": {
        content: (
          <>
            <p>
              Scheduling my classes through Workday was tedious — copying
              times by hand, fixing time zones, and juggling course changes
              every week. So I built a web app that does it all automatically, and deployed it with Vercel.
            </p>
            <p>
              The UBC Workday → Calendar tool takes your course schedule and
              converts it into a downloadable iCalendar file you can import
              straight into Google or Apple Calendar. Built with Python, React,
              and TypeScript, it parses Workday’s messy HTML behind the scenes
              and delivers clean, perfectly timed events in seconds.
            </p>
            <p>
              What started as a weekend project to save myself time ended up
              helping over a hundred students manage their schedules seamlessly
              — all through a single link shared across campus.
            </p>
            <p>
              <a
                href="https://ubcworkdaycalendartool.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit the tool
              </a>
            </p>
          </>
        ),
      },
      "This-website": {
        content: (
          <>
            <p>
              This website is a personal project to showcase my skills and
              projects in a more creative and interactive way. I&apos;ve always
              loved drawing, and I wanted to incorporate that into my
              portfolio. It&apos;s built with Next.js and uses a zoomable SVG for
              navigation.
            </p>
            <p>
              This is the reference I used for the website drawing (ignore my messy desk):
            </p>
            <img
              src="/assets/referenceimage.jpg"
              alt="Reference photo used for the website drawing"
              style={{ width: "100%", height: "auto", border: "2px solid #000" }}
            />
          </>
        ),
      },
      UBCCARD: {
        content: (
          <>
            <p>
              I&apos;m a 2nd year computer engineering student at the University
              of British Columbia.
            </p>
            <p>
              <strong>Relevant Coursework:</strong> Data Structures and
              Algorithms, Object-Oriented Programming, Linear Algebra,
              Probability & Statistics, FPGA Design, Digital Systems
            </p>
          </>
        ),
      },
      Midi: {
        content: (
          <>
            <p>
              I use this AKAI APC Key25 to record instrumentals for my music!
              I&apos;ve studied classical piano since I was five years old, and
              my favourite composer is Chopin. Here&apos;s me performing his
              first piano concerto with the VSO Symphony Orchestra at the
              Orpheum Theatre:
            </p>
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/ueOshaElP9E"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </>
        ),
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
      const target = e.target.closest("g[id]");
      if (
        target &&
        (popupsData[target.id] ||
          ["Resume", "Github", "Linkedin"].includes(target.id))
      ) {
        target.style.cursor = "pointer";
        target.style.transition =
          "transform 0.2s ease-in-out, filter 0.2s ease-in-out";
        target.style.transform = "translateY(-2px)";
        target.style.filter = "drop-shadow(1px 1px 1px rgb(0 0 0 / 0.4))";

        const paths = target.querySelectorAll("path");
        paths.forEach((path) => {
          const originalStroke = path.getAttribute("stroke");
          if (originalStroke) {
            path.setAttribute("data-original-stroke", originalStroke);
          }
          path.setAttribute("stroke", "#4287f5");
        });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest("g[id]");
      if (target) {
        target.style.transform = "";
        target.style.filter = "";

        const paths = target.querySelectorAll("path");
        paths.forEach((path) => {
          const originalStroke = path.getAttribute("data-original-stroke");
          if (originalStroke) {
            path.setAttribute("stroke", originalStroke);
            path.removeAttribute("data-original-stroke");
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
      <div className={styles.fixedTitle}>Simone Ghosh</div>
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