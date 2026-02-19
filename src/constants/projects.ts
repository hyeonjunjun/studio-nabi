export interface Project {
    id: string;
    title: string;
    client: string;
    sector: "Fashion" | "Automotive" | "SaaS" | "Industrial" | "Makers";
    year: string;
    image: string;
    mood: string;
    /** Specimen metadata */
    classification: string;
    habitat: string;
    status: "Active" | "Archived";
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
        id: "01",
        title: "VOGUE REDESIGN",
        client: "Condé Nast",
        sector: "Fashion",
        year: "2026",
        image: "/images/vogue_preview.png",
        mood: "#7f1d1d",
        classification: "Digital Maximalism",
        habitat: "Global Editorial",
        status: "Active",
        editorial: {
            headline: "The Rebirth of Red",
            subhead: "Digital Maximalism",
            copy: "Reimagining the digital presence of the world's most influential fashion authority. A system built on tension, white space, and typographic authority.",
            images: ["/images/vogue-1.jpg", "/images/vogue-2.jpg"],
        },
        schematic: {
            stack: ["Next.js 14", "WebGL", "Sanity CMS"],
            grid: "12-Col Liquid",
            typography: "Bodoni Moda / Inter",
            colors: ["#7f1d1d", "#000000", "#ffffff"],
        },
    },
    {
        id: "02",
        title: "MODEL 3 INTERFACE",
        client: "Tesla",
        sector: "Automotive",
        year: "2025",
        image: "/images/tesla_preview.png",
        mood: "#172554",
        classification: "HMI Design System",
        habitat: "Automotive Cockpit",
        status: "Active",
        editorial: {
            headline: "Autonomy in Motion",
            subhead: "HMI Design System",
            copy: "Defining the interaction language for Level 5 autonomy. Trust through transparency.",
            images: ["/images/tesla-1.jpg"],
        },
        schematic: {
            stack: ["C++ / Qt", "React Native", "OpenGL"],
            grid: "Fluid 8px",
            typography: "Gotham Pro / Mono",
            colors: ["#172554", "#e2e8f0"],
        },
    },
    {
        id: "03",
        title: "CHECKOUT V3",
        client: "Stripe",
        sector: "SaaS",
        year: "2025",
        image: "/images/stripe_preview.png",
        mood: "#6366f1",
        classification: "Infrastructure",
        habitat: "Global Commerce",
        status: "Active",
        editorial: {
            headline: "The Invisible Ledger",
            subhead: "Financial Infrastructure",
            copy: "Reducing friction in global commerce to zero. A study in microscopic interaction design.",
            images: [],
        },
        schematic: {
            stack: ["React", "Ruby", "Sorbet"],
            grid: "4px Baseline",
            typography: "Sohne / Bandit",
            colors: ["#6366f1", "#0a0a0a"],
        },
    },
    {
        id: "04",
        title: "CHAIR STUDY 04",
        client: "Vitra",
        sector: "Industrial",
        year: "2024",
        image: "/images/vitra_preview.png",
        mood: "#404040",
        classification: "Object Research",
        habitat: "Physical Space",
        status: "Archived",
        editorial: {
            headline: "Specific Objects",
            subhead: "Material Research",
            copy: "An exploration of molded plywood and sustainable polymers.",
            images: []
        },
        schematic: {
            stack: ["Rhino 3D", "Keyshot", "CNC"],
            grid: "Golden Ratio",
            typography: "Helvetica Now",
            colors: ["#404040", "#d4d4d4"]
        }
    },
    {
        id: "05",
        title: "SYSTEM ARC",
        client: "Internal",
        sector: "Makers",
        year: "2024",
        image: "/images/system_preview.png",
        mood: "#166534",
        classification: "Internal Tooling",
        habitat: "Design Ops",
        status: "Active",
        editorial: {
            headline: "Order from Chaos",
            subhead: "Design Ops",
            copy: "Internal tooling to accelerate the design-to-code pipeline.",
            images: []
        },
        schematic: {
            stack: ["Rust", "Tauri", "Svelte"],
            grid: "Modular",
            typography: "JetBrains Mono",
            colors: ["#166534", "#f0fdf4"]
        }
    },
];
