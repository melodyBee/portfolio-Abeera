import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { loadPublic, SEED } from './content.js'
import { burst, RM } from './fx.js'
import { startAmbient } from './ambient.js'
import ProjectCard from './ProjectCard.jsx'

const Win = ({ t, children, className = '' }) => (
    <div className={'win ' + className}>
        <div className="t">
            <span className="dots" aria-hidden="true">
                <i />
                <i />
                <i />
            </span>
            {t}
        </div>
        <div className="b">{children}</div>
    </div>
)
const Tags = ({ a }) =>
    a.map((x) => (
        <span className="tag" key={x}>
            {x}
        </span>
    ))

export default function Public() {
    const [data, setData] = useState(null),
        [err, setErr] = useState(false)
    useEffect(() => {
        loadPublic()
            .then(setData)
            .catch(() => {
                setErr(true)
                setData(SEED)
            })
    }, [])
    const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark'),
        [spin, setSpin] = useState(0),
        [menu, setMenu] = useState(false)
    const [open, setOpen] = useState(null),
        [say, setSay] = useState(''),
        flip = useRef(null),
        grid = useRef(null),
        bee = useRef(null),
        star = useRef(null),
        seen = useRef(new Set()),
        bc = useRef(0),
        st = useRef(0)
    const talk = (t) => {
        setSay(t)
        clearTimeout(st.current)
        st.current = setTimeout(() => setSay(''), 4000)
    }
    const retrig = (el, c) => {
        el.classList.remove(c)
        void el.offsetWidth
        el.classList.add(c)
    }
    useEffect(() => {
        if (data) return startAmbient()
    }, [!!data])
    useLayoutEffect(() => {
        const f = flip.current
        flip.current = null
        if (!f || RM.matches) return
        f.forEach(([c, a]) => {
            const b = c.getBoundingClientRect(),
                dx = a.left - b.left,
                dy = a.top - b.top
            if (dx || dy)
                c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], {
                    duration: 450,
                    easing: 'ease',
                })
        })
    }, [open])
    useEffect(() => {
        const k = (e) => {
            if (e.key !== 'Escape') return
            if (open) {
                document.querySelector('#f-' + open + ' .tog')?.focus()
                flip.current = [...grid.current.children].map((c) => [c, c.getBoundingClientRect()])
                setOpen(null)
            }
            setMenu(false)
        }
        addEventListener('keydown', k)
        return () => removeEventListener('keydown', k)
    }, [open])
    if (!data)
        return (
            <p style={{ padding: '2rem' }} role="status">
                Loading…
            </p>
        )
    const s = data.settings,
        projects = data.projects.filter((p) => p.published),
        writing = data.writing.filter((w) => w.published)
    const toggle = (p, btn) => {
        flip.current = [...grid.current.children].map((c) => [c, c.getBoundingClientRect()])
        if (open === p.id) {
            setOpen(null)
            return
        }
        setOpen(p.id)
        burst(btn, p.category === 'Music' ? ['♪', '♫', '♪'] : ['✦', '·', '✧'])
        seen.current.add(p.id)
        if (seen.current.size === 4) talk('Four folders deep. You are officially nosy. 🐝')
        setTimeout(
            () =>
                document.getElementById('f-' + p.id)?.scrollIntoView({
                    behavior: RM.matches ? 'auto' : 'smooth',
                    block: 'nearest',
                }),
            480
        )
    }
    const theme = () => {
        const d = dark ? 'light' : 'dark'
        document.documentElement.dataset.theme = d
        try {
            localStorage.setItem('mb-theme', d)
        } catch {}
        setDark(!dark)
        setSpin((n) => n + 1)
    }
    const skills = [
        ['Building with', s.skillsBuilding],
        ['Writing', s.skillsWriting],
        ['Learning now', s.skillsLearning],
    ].filter(([, a]) => a?.length)
    return (
        <>
            <a className="skip" href="#main">
                Skip to content
            </a>
            {err && (
                <p
                    role="alert"
                    style={{
                        margin: 0,
                        padding: '.5rem 1rem',
                        background: 'var(--pink)',
                        color: 'var(--espresso)',
                    }}
                >
                    Couldn't load the latest content, showing the default version.
                </p>
            )}
            <header>
                <div className="bar">
                    <a className="logo" href="#home">
                        melodyBee
                    </a>
                    <nav
                        id="nav"
                        className={menu ? 'open' : ''}
                        aria-label="Main"
                        onClick={(e) => e.target.closest('a') && setMenu(false)}
                    >
                        <ul>
                            {[
                                ['work', 'Projects'],
                                ['writing', 'Writing'],
                                ['ai', 'Agentic AI'],
                                ['about', 'About'],
                                ['contact', 'Contact'],
                            ].map(([h, l]) => (
                                <li key={h}>
                                    <a href={'#' + h}>{l}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="tools">
                        <button
                            className="ib"
                            id="theme"
                            type="button"
                            aria-label="Dark mode"
                            aria-pressed={dark}
                            onClick={theme}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    display: 'inline-block',
                                    transform: `rotate(${spin * 360}deg)`,
                                }}
                            >
                                {dark ? '☾' : '☀'}
                            </span>
                        </button>
                        <button
                            className="ib"
                            id="menu"
                            type="button"
                            aria-label="Menu"
                            aria-expanded={menu}
                            aria-controls="nav"
                            onClick={() => setMenu((m) => !m)}
                        >
                            <span aria-hidden="true">☰</span>
                        </button>
                    </div>
                </div>
            </header>
            <main id="main">
                <section id="home" className="hero">
                    <button
                        id="star"
                        ref={star}
                        type="button"
                        aria-label="A small star. Press it for a secret note."
                        onClick={() => {
                            retrig(star.current, 'tw')
                            talk('Secret note: the best ideas arrive mid-snack.')
                        }}
                    >
                        ✦
                    </button>
                    <div>
                        <p className="hand">Hi, I'm Abeera Fatima </p>
                        <h1>melodyBee</h1>
                        <p className="lead">{s.heroLead}</p>
                        <div className="cta">
                            <a className="btn" href="#work">
                                See what I've built
                            </a>
                            <a className="btn y" href="#writing">
                                Read my writing
                            </a>
                        </div>
                    </div>
                    <Win t="about_me.txt" className="tilt">
                        <button
                            id="bee"
                            ref={bee}
                            type="button"
                            aria-label="A friendly bee. Press it to make it fly."
                            onClick={() => {
                                retrig(bee.current, 'fly')
                                bc.current++
                                if (bc.current % 3 === 0) burst(bee.current, ['♪', '✦', '★'])
                                if (bc.current === 7)
                                    talk('Bzzz. That is enough flying for one bee.')
                            }}
                        >
                            🐝
                        </button>
                        <ul style={{ paddingLeft: '1.1rem', margin: '.5rem 0 0' }}>
                            <li>Web development</li>
                            <li>Content writing</li>
                            <li>Learning Agentic AI at SMIT</li>
                        </ul>
                        <p id="say" aria-live="polite">
                            {say}
                        </p>
                    </Win>
                </section>
                <section id="work" aria-labelledby="work-h">
                    <p className="kicker">01 · Web development</p>
                    <h2 id="work-h">Things I've built</h2>
                    <p>
                        Open a folder to look inside. Live and GitHub links are always on the card.
                    </p>
                    {projects.length ? (
                        <div className="grid" id="grid" ref={grid}>
                            {projects.map((p, i) => (
                                <ProjectCard
                                    key={p.id}
                                    p={p}
                                    i={i}
                                    open={open === p.id}
                                    onToggle={toggle}
                                />
                            ))}
                        </div>
                    ) : (
                        <p ref={grid}>No projects published yet.</p>
                    )}
                </section>
                <section id="writing" aria-labelledby="writing-h">
                    <p className="kicker">02 · Writing</p>
                    <h2 id="writing-h">Words, mostly mine.</h2>
                    <p style={{ maxWidth: '40rem' }}>{s.writingText}</p>
                    {s.rusticUrl && (
                        <p>
                            <a
                                className="btn g"
                                href={s.rusticUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Visit RusticReads ↗
                                <span style={{ position: 'absolute', left: -999 }}>
                                    {' '}
                                    (opens in a new tab)
                                </span>
                            </a>
                        </p>
                    )}
                    <div className="essays">
                        {writing.length ? (
                            writing.map((w, i) => (
                                <article className="essay" key={w.id}>
                                    <span className="n" aria-hidden="true">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h3>
                                            <a
                                                href={w.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {w.title}
                                            </a>
                                        </h3>
                                        {(w.platform || w.date || w.category) && (
                                            <p
                                                style={{
                                                    margin: '.4rem 0 0',
                                                    fontSize: '.85rem',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {[w.platform, w.category, w.date]
                                                    .filter(Boolean)
                                                    .join(' · ')}
                                            </p>
                                        )}
                                        {w.description && (
                                            <p style={{ margin: '.4rem 0 0' }}>{w.description}</p>
                                        )}
                                    </div>
                                </article>
                            ))
                        ) : (
                            <p>Nothing published here yet.</p>
                        )}
                    </div>
                </section>
                <section id="ai" aria-labelledby="ai-h">
                    <p className="kicker">03 · Agentic AI</p>
                    <h2 id="ai-h">Currently learning.</h2>
                    <div className="cols">
                        <div>
                            <p>
                                <span className="status st-wip">◐ Learning in progress</span>
                            </p>
                            <p>{s.aiText}</p>
                        </div>
                        <div>
                            <div
                                className="term"
                                role="img"
                                aria-label="Terminal panel: status is learning, projects are none yet"
                            >
                                <span className="p">$</span> status
                                <br />
                                learning: agentic AI (SMIT)
                                <br />
                                projects: in progress
                                <br />
                                <span className="p">$</span> <span className="c" />
                            </div>
                        </div>
                    </div>
                </section>
                <section id="about" aria-labelledby="about-h">
                    <p className="kicker">04 · About</p>
                    <h2 id="about-h">A creative problem-solver.</h2>
                    <div className="cols">
                        <div>
                            {s.aboutText.split(/\n\s*\n/).map((t, i) => (
                                <p key={i}>{t}</p>
                            ))}
                        </div>
                        <Win t="skills/">
                            {skills.map(([l, a], i) => (
                                <div key={l}>
                                    <p style={{ margin: i ? '1rem 0 .3rem' : '0 0 .3rem' }}>
                                        <strong>{l}</strong>
                                    </p>
                                    <Tags a={a} />
                                </div>
                            ))}
                        </Win>
                    </div>
                </section>
                <section id="contact" aria-labelledby="contact-h">
                    <p className="kicker">05 · Contact</p>
                    <h2 id="contact-h">Say hello.</h2>
                    <p style={{ maxWidth: '38rem' }}>{s.contactText}</p>
                    <div className="cta">
                        {[
                            ['GitHub', s.github, ''],
                            ['LinkedIn', s.linkedin, 'g'],
                            ['Medium', s.medium, 'y'],
                        ]
                            .filter((x) => x[1])
                            .map(([l, u, c]) => (
                                <a
                                    key={l}
                                    className={'btn ' + c}
                                    href={u}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {l} ↗
                                </a>
                            ))}
                    </div>
                </section>
            </main>
            <footer>
                © {new Date().getFullYear()} Abeera Fatima · {s.footer} ·{' '}
            </footer>
        </>
    )
}
