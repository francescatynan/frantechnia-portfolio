import Image from "next/image";
import ThemeToggle from "./components/theme-toggle";

export default function Home() {
  return (
    <div className="root">
      <header className="header">
        <h1 className="title">
          <a href="#top">Francesca Tynan</a>
        </h1>
        <ThemeToggle />
      </header>

      <main id="top" className="main">
        <aside>
          <nav className="nav">
            <figure className="portrait">
              <Image
                src="/images/francesca-tynan-portrait.jpeg"
                alt="Closeup picture of a woman Francesca Tynan smiling."
                width={440}
                height={440}
                priority
              />
            </figure>
            <div className="links">
              <a href="https://linktr.ee/frantechnia" target="_blank">
                Linktree
              </a>
              <br />
              <a href="https://github.com/francescatynan" target="_blank">
                Github
              </a>
              <br />
              <a href="https://www.linkedin.com/in/francescatynan/" target="_blank">
                LinkedIn
              </a>
              <br />
              <a href="https://www.instagram.com/frantechnia/" target="_blank">
                Instagram
              </a>
              <br />
              <a href="https://www.threads.net/@frantechnia" target="_blank">
                Threads
              </a>
              <br />
              <a href="mailto:contact@francescatynan.co.uk" target="_blank">
                Get in Touch
              </a>
            </div>
          </nav>
        </aside>

        <section className="sections">
          <section>
            <h2 className="section-title">About Me</h2>
            <h3 className="section-subtitle">*Under Reconstruction*</h3>
            <p>
              Welcome to my page, I'm Francesca, a Junior Software Engineer at{" "}
              <a href="https://thinktmb.com" target="_blank">
                TMB Marketing and Communications
              </a>{" "}
              and career switcher with a background in customer service including
              mentoring and training experience, awards for performance and
              production of support materials for my former employer's intranet.
              Additionally I managed a commercial scale support project via Google
              Sheets.
            </p>
            <p>
              I'm a{" "}
              <a href="https://cajigo.com" target="_blank">
                Cajigo
              </a>{" "}
              100 Women in Tech 2024 Mentee, and a{" "}
              <a href="https://codefirstgirls.com" target="_blank">
                Code First Girls
              </a>{" "}
              alumna via the intensive 16 week "CFGDegree" Software/Data
              Engineering bootcamp, 4 week "+Masters" Cyber Security extension and
              8 week Vulnerability Research specialisation, thanks to
              education-only sponsorship from GCGQ kindly making this opportunity
              possible.
            </p>
          </section>

          <section>
            <h2 className="section-title">Technical Awareness</h2>
            <p>
              With my studies delving into security principles and vulnerabilities,
              secure coding practices are at the forefront of my approach. My
              approach to coding is led by concepts like AAA, the CIA triad, the
              importance of HTTPS, input validation and broadly speaking security
              by design to mitigate threats and protect against common
              vulnerabilities. Considerations of access control, salting and
              hashing, and the principle of least privilege (PoLP) are just some of
              the many concepts I'm versed in.
            </p>
            <p>
              I have covered a broad range of learning beyond simply languages.
              Comfortable with MySQL, Python with Flask, HTML, CSS and Javascript,
              I've also written unit tests, utilised test-driven development (TDD),
              Git, Github, Jira, Trello, pair programming, code reviews and written
              assessed reports from the perspective of a security analyst, and a
              vulnerability researcher.
            </p>
            <p>I continue to expand my learning proactively and look eagerly to a long future in this industry.</p>
          </section>

          <section>
            <h2 className="section-title">CFGDegree Group Project</h2>
            <p>
              As a group of six, we finished our Code First Girls CFGDegree Summer
              2024 in Software/Data Engineering by collaborating to create a
              customisable password generator and password manager within a month
              utilising MySQL, Python, Flask, HTML, CSS and JavaScript. I acted as
              project manager and we made use of Jira, GitHub Branches, Trello and
              code reviews. See our results below. We made use of hashing and
              salting amongst other security precautions to protect the data of
              our web app's users.
            </p>
            <video className="video" controls src="/videos/code-first-guard-demo.mp4">
              Your browser does not support the video tag.
            </video>
          </section>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Francesca Tynan. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
