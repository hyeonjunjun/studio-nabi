export interface Project {
    id: string;
    title: string;
    client: string;
    sector: string;
    year: string;
    image: string;
    mood: string;
    /** One-line pitch */
    pitch: string;
    editorial: {
        headline: string;
        subhead: string;
        copy: string;
        images: string[];
    };
    schematic: {
        stack: string[];
        grid: string;
        typography: string;
        colors: string[];
    };
}

export const PROJECTS: Project[] = [
    {
        id: "sift",
        title: "SIFT",
        client: "Personal",
        sector: "Mobile · AI",
        year: "2025",
        image: "/images/sift-v2.jpg",
        mood: "#8b9e6b",
        pitch: "AI-powered content curation — paste any URL, get an instant summary.",
        editorial: {
            headline: "Save Anything, Understand Everything",
            subhead: "Content Intelligence",
            copy: "Sift transforms how you save content from the internet. Paste any URL — TikTok, Instagram, YouTube, or the open web — and Sift instantly scrapes, summarizes, and organizes it into a beautiful feed. Built with an optimistic-insert architecture that makes saving feel instant, even while the backend orchestrates scrapers and AI in the background.",
            images: ["/images/sift-v2.jpg", "/images/sift-v2.jpg", "/images/sift-v2.jpg"],
        },
        schematic: {
            stack: ["React Native", "Supabase", "Vercel", "OpenAI GPT-4o", "Apify"],
            grid: "iOS HIG · 8px Baseline",
            typography: "SF Pro / SF Mono",
            colors: ["#8b9e6b", "#0a0a0a", "#faf9f7"],
        },
    },
    {
        id: "02",
        title: "VerbAItim",
        client: "Linguistic Preservation Initiative",
        sector: "AI / SaaS",
        year: "2026",
        image: "/images/verbaitim-hero.png",
        mood: "#4169E1",
        pitch: "High-precision linguistic SaaS bridging field documentation with pedagogical output.",
        editorial: {
            headline: "The future of language is verifiable data.",
            subhead: "Scientific Naturalism meets Awwwards-level Motion.",
            copy: "VerbAItim bridges the gap between field linguistics and diverse pedagogical output. By leveraging Allosaurus for universal phonetic capture and ByT5 for byte-level preservation, we create a 'Pipeline of Preservation' that ensures indigenous data sovereignty through rigorous Chain of Custody verification. The interface balances archival warmth with industrial precision, creating a digital workbench that feels both organic and surgical.",
            images: [
                "/images/verbaitim-hero.png",
                "/images/verbaitim-interface.png",
                "/images/verbaitim-hero.png",
                "/images/verbaitim-interface.png",
            ],
        },
        schematic: {
            stack: ["Next.js", "Framer Motion", "Lovable", "Allosaurus", "ByT5"],
            grid: "4px Industrial Precision",
            typography: "Instrument Serif / Inter",
            colors: ["#FAFAFA", "#0A0A0A", "#4169E1"],
        },
    },
    {
        id: "03",
        title: "CALIPER",
        client: "Internal Tooling",
        sector: "Design Systems",
        year: "2026",
        image: "/images/caliper-main.png",
        mood: "#FF4400",
        pitch: "Real-time visual guidance for structured thinking inside text fields.",
        editorial: {
            headline: "Precision measurement for thought.",
            subhead: "Automotive-Grade Input",
            copy: "Caliper lives inside existing text fields, providing real-time visual guidance. Designed with the rigor of high-end automotive displays, it enforces structured thinking through live color coding and floating dial controls. A rejection of playfulness in favor of pure instrument precision.",
            images: ["/images/caliper-main.png", "/images/caliper-main.png", "/images/caliper-main.png"],
        },
        schematic: {
            stack: ["React", "Canvas API", "Local-First"],
            grid: "Dense Monospace",
            typography: "JetBrains Mono / Inter",
            colors: ["#E5E5E5", "#FF4400", "#111111"],
        },
    },
];
