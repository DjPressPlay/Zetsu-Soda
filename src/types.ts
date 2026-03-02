export interface SodaCan {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic';
  category: string;
  prompt: string;
  imageUrl?: string | null;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  cans: SodaCan[];
}

export const SODA_DATA: Category[] = [
  {
    id: 'analytics',
    name: 'Analytics & Data',
    icon: '📊',
    cans: [
      { 
        id: 'a1', 
        name: 'Analytics Dashboard', 
        description: 'Real-time metrics, charts & KPI tracking', 
        icon: '📊', 
        rarity: 'Common', 
        category: 'analytics',
        prompt: "Build a real-time analytics dashboard using Recharts. Include a line chart for traffic, a bar chart for conversions, and a grid of 4 stat cards showing total users, active sessions, bounce rate, and revenue."
      },
      { 
        id: 'a2', 
        name: 'Audit Trail System', 
        description: 'Log every action, change & access event', 
        icon: '🔍', 
        rarity: 'Rare', 
        category: 'analytics',
        prompt: "Create an audit trail table that displays user actions. Each row should show the timestamp, user avatar, action type (e.g., 'Update', 'Delete'), and a 'View Details' button that opens a JSON diff viewer."
      },
      { 
        id: 'a3', 
        name: 'Anomaly Detector', 
        description: 'Flag unusual patterns in your data streams', 
        icon: '⚠️', 
        rarity: 'Rare', 
        category: 'analytics',
        prompt: "Design a monitoring widget that highlights data points outside 2 standard deviations. Use a scatter plot where anomalies are colored bright red and pulsing. Include a sidebar list of 'Recent Alerts'."
      },
      { 
        id: 'a4', 
        name: 'Attribution Tracker', 
        description: 'Map revenue back to every touchpoint', 
        icon: '🎯', 
        rarity: 'Rare', 
        category: 'analytics',
        prompt: "Build a multi-touch attribution visualizer. Show a Sankey diagram or flow chart tracing the user journey from first click (social, search, direct) to final conversion, with percentage weights for each channel."
      },
      { 
        id: 'a5', 
        name: 'A/B Test Manager', 
        description: 'Run, track & analyze split tests at scale', 
        icon: '🧪', 
        rarity: 'Common', 
        category: 'analytics',
        prompt: "Create an A/B test management UI. Include a list of active experiments with 'Control' vs 'Variant' performance bars, statistical significance indicators (p-value), and a 'Winner' badge."
      },
    ]
  },
  {
    id: 'automation',
    name: 'Automation & AI',
    icon: '🤖',
    cans: [
      { 
        id: 'b1', 
        name: 'Automation Builder', 
        description: 'Drag-and-drop workflow automation studio', 
        icon: '⚙️', 
        rarity: 'Common', 
        category: 'automation',
        prompt: "Build a node-based workflow editor using React Flow. Allow users to connect 'Trigger' nodes (like Webhook or Schedule) to 'Action' nodes (like Send Email or Update DB). Include a properties panel for node config."
      },
      { 
        id: 'b2', 
        name: 'AI Agent Console', 
        description: 'Deploy & monitor autonomous AI agents', 
        icon: '🤖', 
        rarity: 'Epic', 
        category: 'automation',
        prompt: "Design a terminal-style console for monitoring AI agents. Show a scrolling log of 'Thoughts' and 'Actions', a status sidebar with CPU/Memory usage, and a 'Pause/Resume' control center."
      },
      { 
        id: 'b3', 
        name: 'Auto-Responder System', 
        description: 'Smart reply triggers for email & chat', 
        icon: '💬', 
        rarity: 'Common', 
        category: 'automation',
        prompt: "Create a smart auto-responder setup page. Let users define keyword triggers and AI-generated response templates. Include a 'Test' section where they can type a message and see the predicted response."
      },
      { 
        id: 'b4', 
        name: 'Approval Workflow Engine', 
        description: 'Multi-step approvals with role-based routing', 
        icon: '✅', 
        rarity: 'Rare', 
        category: 'automation',
        prompt: "Build a multi-stage approval timeline. Show a vertical progress tracker with 'Pending', 'Approved', and 'Rejected' states. Include buttons for 'Approve' and 'Request Changes' with a comment field."
      },
    ]
  },
  {
    id: 'apps',
    name: 'Apps & Tools',
    icon: '🛠️',
    cans: [
      { 
        id: 'c1', 
        name: 'Appointment Scheduler', 
        description: 'Booking system with availability sync', 
        icon: '📅', 
        rarity: 'Common', 
        category: 'apps',
        prompt: "Design a clean calendar booking interface. Show a monthly grid where available days are highlighted. When a day is clicked, show a list of time slots. Include a form for name, email, and reason for visit."
      },
      { 
        id: 'c2', 
        name: 'Asset Manager', 
        description: 'Upload, tag, organize & share digital assets', 
        icon: '🗃️', 
        rarity: 'Common', 
        category: 'apps',
        prompt: "Build a file explorer UI. Include a sidebar for folders, a main grid of file thumbnails (images, docs, videos), and a 'Details' pane showing file size, type, and a 'Copy Public Link' button."
      },
      { 
        id: 'c3', 
        name: 'Access Control Panel', 
        description: 'Roles, permissions & user access management', 
        icon: '🔐', 
        rarity: 'Rare', 
        category: 'apps',
        prompt: "Create a permissions matrix. Rows are 'Features' and columns are 'Roles' (Admin, Editor, Viewer). Use checkboxes to toggle access. Include a 'Save Changes' button with a loading state."
      },
      { 
        id: 'c4', 
        name: 'Affiliate Tracker', 
        description: 'Links, conversions & commission dashboards', 
        icon: '🔗', 
        rarity: 'Common', 
        category: 'apps',
        prompt: "Design a dashboard for affiliates. Show their unique referral link, a chart of clicks over time, and a table of 'Recent Referrals' with commission status (Pending/Paid)."
      },
      { 
        id: 'c5', 
        name: 'Ad Campaign Manager', 
        description: 'Plan, launch & monitor paid ad campaigns', 
        icon: '📣', 
        rarity: 'Common', 
        category: 'apps',
        prompt: "Build an ad campaign dashboard. Include sections for 'Active Campaigns', 'Budget Allocation', and 'Performance Metrics' (CTR, CPC, ROAS). Use a bar chart to compare campaign performance."
      },
      { 
        id: 'c6', 
        name: 'API Tester', 
        description: 'Send requests, inspect responses & debug APIs', 
        icon: '🧰', 
        rarity: 'Common', 
        category: 'apps',
        prompt: "Create a Postman-like API tester. Include a URL input, a method selector (GET, POST, etc.), a headers editor, and a JSON response viewer with syntax highlighting."
      },
      { 
        id: 'c7', 
        name: 'Account Dashboard', 
        description: 'User profile, settings & activity overview', 
        icon: '👤', 
        rarity: 'Common', 
        category: 'apps',
        prompt: "Design a user account dashboard. Include a profile section with avatar upload, a 'Security' tab for password changes, and a 'Recent Activity' feed."
      },
      { 
        id: 'c8', 
        name: 'Alert System', 
        description: 'Custom triggers, thresholds & multi-channel alerts', 
        icon: '🔔', 
        rarity: 'Common', 
        category: 'apps',
        prompt: "Build an alert configuration UI. Allow users to set thresholds for specific metrics and choose notification channels (Email, Slack, SMS). Include a 'Test Notification' button."
      },
    ]
  },
  {
    id: 'niche',
    name: 'Niche / Interesting',
    icon: '🌀',
    cans: [
      { 
        id: 'd1', 
        name: 'Astrology Chart Generator', 
        description: 'Birth charts, transits & cosmic readings', 
        icon: '🌌', 
        rarity: 'Epic', 
        category: 'niche',
        prompt: "Build a mystical birth chart visualizer. Use a circular SVG to map planets to zodiac houses based on a date/time input. Include a 'Daily Transit' reading generated by AI."
      },
      { 
        id: 'd2', 
        name: 'Argument Mapper', 
        description: 'Visualize logic, claims & counterarguments', 
        icon: '🗺️', 
        rarity: 'Rare', 
        category: 'niche',
        prompt: "Create a tree-based argument map. Start with a 'Main Claim' node, then branch out into 'Supporting Evidence' (green) and 'Counter-Arguments' (red). Allow users to add nodes dynamically."
      },
      { 
        id: 'd3', 
        name: 'Annotation Tool', 
        description: 'Highlight, comment & collaborate on any doc', 
        icon: '✏️', 
        rarity: 'Common', 
        category: 'niche',
        prompt: "Build a document annotation tool. Allow users to select text and add comments in a sidebar. Highlight annotated text and show a 'Comment Count' badge next to it."
      },
      { 
        id: 'd4', 
        name: 'Auction Platform', 
        description: 'Live bidding, lots & real-time countdown', 
        icon: '🏷️', 
        rarity: 'Epic', 
        category: 'niche',
        prompt: "Design a live auction interface. Include a high-resolution image of the 'Lot', a real-time 'Current Bid' display, a 'Place Bid' button, and a scrolling 'Bid History' log."
      },
      { 
        id: 'd5', 
        name: 'Archive Explorer', 
        description: 'Browse, search & restore historical records', 
        icon: '📦', 
        rarity: 'Rare', 
        category: 'niche',
        prompt: "Create an archive browser. Include a timeline-based navigation, a search bar with filters (date, category, author), and a 'Restore' button for archived items."
      },
      { 
        id: 'd6', 
        name: 'Accountability Tracker', 
        description: 'Goals, check-ins & streak-based accountability', 
        icon: '🏆', 
        rarity: 'Common', 
        category: 'niche',
        prompt: "Build a habit tracker with streaks. Show a grid of days for the current month, where completed days are colored. Include a 'Current Streak' counter and a 'Goal' progress bar."
      },
      { 
        id: 'd7', 
        name: 'Answer Engine', 
        description: 'Internal Q&A system trained on your docs', 
        icon: '🧠', 
        rarity: 'Epic', 
        category: 'niche',
        prompt: "Design an AI search interface. Include a large, centered search bar. When a query is entered, show a 'Synthesized Answer' at the top with citations, followed by a list of source documents."
      },
      { 
        id: 'd8', 
        name: 'Almanac Builder', 
        description: 'Curate yearly reference & knowledge collections', 
        icon: '📖', 
        rarity: 'Rare', 
        category: 'niche',
        prompt: "Create a knowledge curation tool. Allow users to add 'Entries' with rich text, images, and tags. Include a 'Yearly View' that organizes entries into a digital almanac."
      },
    ]
  }
];
