/**
 * TechEngage - Comprehensive Engineering Question Bank
 * Includes CSE, EEE, ME, CE, ECE, and Engineering Mathematics
 * Supports LaTeX math equations, code snippets, SVG schematics, hints, and detailed solutions.
 */

window.ENGINEERING_QUESTIONS = [
  // ==========================================
  // COMPUTER SCIENCE & ENGINEERING (CSE)
  // ==========================================
  {
    id: "cse_01",
    branch: "cse",
    topic: "Data Structures & Algorithms",
    difficulty: "intermediate",
    question: "What is the worst-case time complexity of inserting an element into a Max-Heap containing \\( n \\) elements?",
    options: [
      "\\( O(1) \\)",
      "\\( O(\\log n) \\)",
      "\\( O(n) \\)",
      "\\( O(n \\log n) \\)"
    ],
    correctAnswer: 1,
    explanation: "In a Max-Heap, a new key is initially appended to the end of the complete binary tree and then percolates up (heapified up) towards the root. Since the height of a binary heap with \\( n \\) nodes is \\( \\lfloor \\log_2 n \\rfloor \\), the maximum number of swaps required is proportional to the tree height, yielding \\( O(\\log n) \\).",
    hint: "Think about the maximum height of a balanced complete binary tree of size n."
  },
  {
    id: "cse_02",
    branch: "cse",
    topic: "Algorithms & C Programming",
    difficulty: "intermediate",
    question: "Analyze the following recursive C function. What value is returned when calling `fun(4, 3)`?",
    codeSnippet: `int fun(int a, int b) {
    if (b == 0) return 0;
    if (b % 2 == 0) return fun(a + a, b / 2);
    return fun(a + a, b / 2) + a;
}`,
    options: [
      "7",
      "12",
      "14",
      "16"
    ],
    correctAnswer: 1,
    explanation: "This function implements Russian Peasant Multiplication (binary multiplication algorithm) to calculate \\( a \\times b \\):\n- `fun(4, 3)` (b=3 odd) \\( \\rightarrow \\) `fun(8, 1) + 4`\n- `fun(8, 1)` (b=1 odd) \\( \\rightarrow \\) `fun(16, 0) + 8`\n- `fun(16, 0)` (b=0) \\( \\rightarrow \\) `0`\nSumming back up: \\( 0 + 8 + 4 = 12 \\). Thus, \\( 4 \\times 3 = 12 \\).",
    hint: "Trace the function call stack: b is halved each step while a is doubled."
  },
  {
    id: "cse_03",
    branch: "cse",
    topic: "Operating Systems",
    difficulty: "advanced",
    question: "Consider a system with 4 processes and 3 resource types (R1, R2, R3). Total units available are (10, 5, 7). Which allocation state guarantees freedom from Deadlock under the Banker's Algorithm?",
    options: [
      "State where total allocated exceeds total available resources",
      "State for which there exists at least one Safe Execution Sequence",
      "State where all processes hold equal numbers of resources",
      "State with zero waiting processes regardless of max request"
    ],
    correctAnswer: 1,
    explanation: "The Banker's Algorithm ensures deadlock avoidance by ensuring the system always remains in a **Safe State**. A state is safe if there exists a sequence of processes \\( \\langle P_1, P_2, \\dots, P_n \\rangle \\) such that for each \\( P_i \\), the resources that \\( P_i \\) can still request can be satisfied by currently available resources plus resources held by all previous processes.",
    hint: "Recall Dijkstra's algorithm for checking safe state matrix."
  },
  {
    id: "cse_04",
    branch: "cse",
    topic: "Computer Networks",
    difficulty: "beginner",
    question: "In the TCP/IP protocol stack, which protocol is responsible for resolving an IP address to a physical MAC address on a local area network?",
    options: [
      "DNS (Domain Name System)",
      "DHCP (Dynamic Host Configuration Protocol)",
      "ARP (Address Resolution Protocol)",
      "ICMP (Internet Control Message Protocol)"
    ],
    correctAnswer: 2,
    explanation: "ARP (Address Resolution Protocol) maps dynamic 32-bit IPv4 addresses to fixed 48-bit Ethernet MAC hardware addresses inside a local subnet broadcast domain.",
    hint: "Look for the protocol that acts as a bridge between Layer 3 (Network) and Layer 2 (Data Link)."
  },

  // ==========================================
  // ELECTRICAL & ELECTRONICS ENGINEERING (EEE)
  // ==========================================
  {
    id: "eee_01",
    branch: "eee",
    topic: "Circuit Theory & Network Analysis",
    difficulty: "intermediate",
    question: "For the linear resistive circuit shown below, calculate the Thevenin Equivalent Voltage \\( V_{th} \\) across terminals A-B.",
    svgDiagram: `<svg viewBox="0 0 400 180" class="quiz-svg">
      <line x1="50" y1="130" x2="350" y2="130" stroke="var(--primary-color)" stroke-width="3"/>
      <line x1="50" y1="40" x2="130" y2="40" stroke="var(--primary-color)" stroke-width="3"/>
      <circle cx="50" cy="85" r="22" fill="none" stroke="var(--accent-cyan)" stroke-width="3"/>
      <text x="50" y="80" text-anchor="middle" fill="var(--text-main)" font-size="12" font-weight="bold">+ 24V</text>
      <text x="50" y="98" text-anchor="middle" fill="var(--text-main)" font-size="12">-</text>
      <line x1="50" y1="40" x2="50" y2="63" stroke="var(--primary-color)" stroke-width="3"/>
      <line x1="50" y1="107" x2="50" y2="130" stroke="var(--primary-color)" stroke-width="3"/>
      
      <!-- Resistor R1 -->
      <path d="M 130 40 L 140 25 L 155 55 L 170 25 L 185 55 L 200 25 L 210 40" fill="none" stroke="var(--accent-amber)" stroke-width="3"/>
      <text x="170" y="20" text-anchor="middle" fill="var(--text-main)" font-size="13" font-weight="bold">R1 = 6 Ω</text>
      
      <!-- Resistor R2 (Parallel) -->
      <line x1="210" y1="40" x2="230" y2="40" stroke="var(--primary-color)" stroke-width="3"/>
      <line x1="230" y1="40" x2="230" y2="60" stroke="var(--primary-color)" stroke-width="3"/>
      <path d="M 230 60 L 215 70 L 245 85 L 215 100 L 245 115 L 230 125" fill="none" stroke="var(--accent-amber)" stroke-width="3"/>
      <line x1="230" y1="125" x2="230" y2="130" stroke="var(--primary-color)" stroke-width="3"/>
      <text x="260" y="90" text-anchor="start" fill="var(--text-main)" font-size="13" font-weight="bold">R2 = 12 Ω</text>

      <!-- Terminals A and B -->
      <line x1="230" y1="40" x2="350" y2="40" stroke="var(--primary-color)" stroke-width="3"/>
      <circle cx="350" cy="40" r="5" fill="var(--accent-cyan)"/>
      <circle cx="350" cy="130" r="5" fill="var(--accent-cyan)"/>
      <text x="365" y="45" fill="var(--accent-cyan)" font-size="16" font-weight="bold">A</text>
      <text x="365" y="135" fill="var(--accent-cyan)" font-size="16" font-weight="bold">B</text>
    </svg>`,
    options: [
      "12 V",
      "16 V",
      "18 V",
      "24 V"
    ],
    correctAnswer: 1,
    explanation: "Since terminals A-B are open-circuited, no current flows beyond node A. The circuit forms a simple voltage divider between \\( R_1 = 6\\,\\Omega \\) and \\( R_2 = 12\\,\\Omega \\):\n\n\\[ V_{th} = V_{AB} = V_s \\cdot \\frac{R_2}{R_1 + R_2} = 24 \\cdot \\frac{12}{6 + 12} = 24 \\cdot \\frac{12}{18} = 16\\text{ V} \\]",
    hint: "Apply the voltage divider rule across the parallel branch resistor R2."
  },
  {
    id: "eee_02",
    branch: "eee",
    topic: "Electrical Machines",
    difficulty: "advanced",
    question: "A 4-pole, 50 Hz, 3-phase induction motor runs at a slip speed of \\( s = 0.04 \\) (4%). What is the actual rotor speed \\( N_r \\) in RPM?",
    options: [
      "1440 RPM",
      "1480 RPM",
      "1500 RPM",
      "1560 RPM"
    ],
    correctAnswer: 0,
    explanation: "1. Calculate Synchronous Speed \\( N_s \\):\n\\[ N_s = \\frac{120 \\cdot f}{P} = \\frac{120 \\cdot 50}{4} = 1500\\text{ RPM} \\]\n\n2. Calculate Rotor Speed \\( N_r \\):\n\\[ N_r = N_s (1 - s) = 1500 \\cdot (1 - 0.04) = 1500 \\cdot 0.96 = 1440\\text{ RPM} \\]",
    hint: "First find Ns using 120*f/P, then multiply by (1 - s)."
  },
  {
    id: "eee_03",
    branch: "eee",
    topic: "Control Systems",
    difficulty: "intermediate",
    question: "What is the steady-state error \\( e_{ss} \\) of a Type-1 unity feedback system for a unit step input?",
    options: [
      "Infinity (\\( \\infty \\))",
      "\\( \\frac{1}{1 + K_p} \\)",
      "Zero (0)",
      "Undefined"
    ],
    correctAnswer: 2,
    explanation: "For a Type-1 system, the open-loop transfer function contains one integrator at the origin (\\( s=0 \\)). The position error constant \\( K_p = \\lim_{s \\to 0} G(s)H(s) = \\infty \\). Therefore, steady-state error for a unit step input is \\( e_{ss} = \\frac{1}{1 + K_p} = \\frac{1}{1 + \\infty} = 0 \\).",
    hint: "A Type-1 system has an integrator s in the denominator which makes Kp approach infinity."
  },

  // ==========================================
  // MECHANICAL ENGINEERING (ME)
  // ==========================================
  {
    id: "me_01",
    branch: "me",
    topic: "Thermodynamics",
    difficulty: "intermediate",
    question: "A Carnot heat engine operates between a high temperature reservoir at \\( T_H = 600\\text{ K} \\) and a low temperature sink at \\( T_L = 300\\text{ K} \\). What is the maximum theoretical efficiency \\( \\eta_{Carnot} \\)?",
    options: [
      "33.3%",
      "50.0%",
      "66.7%",
      "75.0%"
    ],
    correctAnswer: 1,
    explanation: "Carnot efficiency represents the absolute upper limit of thermal efficiency for any heat engine operating between two thermal reservoirs:\n\n\\[ \\eta_{Carnot} = 1 - \\frac{T_L}{T_H} = 1 - \\frac{300}{600} = 1 - 0.5 = 0.50 \\quad (50\\%) \\]",
    hint: "Use Carnot's formula: eta = 1 - (TL / TH) with absolute Kelvin temperatures."
  },
  {
    id: "me_02",
    branch: "me",
    topic: "Strength of Materials",
    difficulty: "advanced",
    question: "A solid circular shaft of diameter \\( d \\) is subjected to a twisting moment (torque) \\( T \\). What is the maximum shear stress \\( \\tau_{max} \\) induced at the outer surface of the shaft?",
    options: [
      "\\( \\frac{16T}{\\pi d^3} \\)",
      "\\( \\frac{32T}{\\pi d^3} \\)",
      "\\( \\frac{16T}{\\pi d^2} \\)",
      "\\( \\frac{8T}{\\pi d^3} \\)"
    ],
    correctAnswer: 0,
    explanation: "From the Torsion formula: \\( \\frac{T}{J} = \\frac{\\tau}{R} \\).\n- Polar Moment of Inertia for solid circle: \\( J = \\frac{\\pi d^4}{32} \\)\n- Outer radius: \\( R = \\frac{d}{2} \\)\n\n\\[ \\tau_{max} = \\frac{T \\cdot R}{J} = \\frac{T \\cdot (d/2)}{\\frac{\\pi d^4}{32}} = \\frac{16T}{\\pi d^3} \\]",
    hint: "Substitute J = (pi * d^4) / 32 into the torsion equation."
  },
  {
    id: "me_03",
    branch: "me",
    topic: "Fluid Mechanics",
    difficulty: "beginner",
    question: "Bernoulli's equation expresses the conservation of which fundamental physical quantity along a streamline in an incompressible, inviscid fluid flow?",
    options: [
      "Mass",
      "Linear Momentum",
      "Mechanical Energy",
      "Angular Momentum"
    ],
    correctAnswer: 2,
    explanation: "Bernoulli's equation \\( P + \\frac{1}{2}\\rho v^2 + \\rho g z = \\text{Constant} \\) is a mathematical formulation of the **Conservation of Mechanical Energy** (pressure head + velocity head + elevation head) for steady, incompressible, frictionless flow.",
    hint: "Pressure energy + Kinetic energy + Potential energy per unit volume stays constant."
  },

  // ==========================================
  // CIVIL ENGINEERING (CE)
  // ==========================================
  {
    id: "ce_01",
    branch: "ce",
    topic: "Structural Analysis",
    difficulty: "intermediate",
    question: "For a simply supported beam of length \\( L \\) carrying a uniform distributed load \\( w \\) (N/m) over its entire span, what is the maximum bending moment \\( M_{max} \\)?",
    svgDiagram: `<svg viewBox="0 0 400 150" class="quiz-svg">
      <!-- Beam -->
      <rect x="50" y="80" width="300" height="12" fill="var(--accent-indigo)" rx="2"/>
      
      <!-- Supports -->
      <polygon points="50,92 35,120 65,120" fill="var(--accent-cyan)"/>
      <polygon points="350,92 335,120 365,120" fill="var(--accent-cyan)"/>
      <circle cx="340" cy="125" r="4" fill="var(--text-main)"/>
      <circle cx="360" cy="125" r="4" fill="var(--text-main)"/>
      
      <!-- UDL arrows -->
      <g stroke="var(--accent-amber)" stroke-width="2" fill="none">
        <path d="M 50 40 Q 65 50 80 40 Q 95 50 110 40 Q 125 50 140 40 Q 155 50 170 40 Q 185 50 200 40 Q 215 50 230 40 Q 245 50 260 40 Q 275 50 290 40 Q 305 50 320 40 Q 335 50 350 40"/>
        <line x1="50" y1="40" x2="50" y2="75"/>
        <line x1="125" y1="40" x2="125" y2="75"/>
        <line x1="200" y1="40" x2="200" y2="75"/>
        <line x1="275" y1="40" x2="275" y2="75"/>
        <line x1="350" y1="40" x2="350" y2="75"/>
      </g>
      <text x="200" y="30" text-anchor="middle" fill="var(--accent-amber)" font-size="13" font-weight="bold">w (UDL)</text>
      <text x="200" y="142" text-anchor="middle" fill="var(--text-main)" font-size="12">Span L</text>
    </svg>`,
    options: [
      "\\( \\frac{w L^2}{4} \\)",
      "\\( \\frac{w L^2}{8} \\)",
      "\\( \\frac{w L^2}{12} \\)",
      "\\( \\frac{w L}{2} \\)"
    ],
    correctAnswer: 1,
    explanation: "For a simply supported beam with UDL \\( w \\):\n- Reactions at ends: \\( R_A = R_B = \\frac{w L}{2} \\)\n- Bending moment equation at distance \\( x \\): \\( M(x) = \\frac{w L}{2}x - \\frac{w x^2}{2} \\)\n- Maximum moment occurs at mid-span (\\( x = L/2 \\)):\n\n\\[ M_{max} = \\frac{w L}{2} \\left(\\frac{L}{2}\\right) - \\frac{w}{2} \\left(\\frac{L}{2}\\right)^2 = \\frac{w L^2}{4} - \\frac{w L^2}{8} = \\frac{w L^2}{8} \\]",
    hint: "Mid-span bending moment under UDL is w * L^2 divided by 8."
  },
  {
    id: "ce_02",
    branch: "ce",
    topic: "Geotechnical Engineering",
    difficulty: "advanced",
    question: "According to Terzaghi's effective stress principle in soil mechanics, the effective stress \\( \\sigma' \\) is defined as:",
    options: [
      "Total stress minus pore water pressure (\\( \\sigma' = \\sigma - u \\))",
      "Total stress plus pore water pressure (\\( \\sigma' = \\sigma + u \\))",
      "Pore water pressure divided by total stress",
      "Hydrostatic stress multiplied by soil porosity"
    ],
    correctAnswer: 0,
    explanation: "Terzaghi established that soil shear strength and deformation depend strictly on effective stress \\( \\sigma' \\), which is the intergranular stress carried by soil skeleton grains: \\( \\sigma' = \\sigma - u \\), where \\( \\sigma \\) is total overburden stress and \\( u \\) is pore water pressure.",
    hint: "Effective stress is the net stress felt by soil particles excluding fluid pressure."
  },

  // ==========================================
  // ELECTRONICS & COMMUNICATION (ECE)
  // ==========================================
  {
    id: "ece_01",
    branch: "ece",
    topic: "Digital Electronics",
    difficulty: "beginner",
    question: "Identify the boolean output expression \\( Y \\) for the logic circuit containing an XOR gate followed by a NAND gate as shown.",
    svgDiagram: `<svg viewBox="0 0 380 140" class="quiz-svg">
      <!-- Input lines A, B -->
      <text x="25" y="45" fill="var(--accent-cyan)" font-size="14" font-weight="bold">A</text>
      <text x="25" y="95" fill="var(--accent-cyan)" font-size="14" font-weight="bold">B</text>
      <line x1="45" y1="40" x2="100" y2="40" stroke="var(--primary-color)" stroke-width="3"/>
      <line x1="45" y1="90" x2="100" y2="90" stroke="var(--primary-color)" stroke-width="3"/>
      
      <!-- XOR Gate Symbol -->
      <path d="M 90 30 Q 110 65 90 100 M 98 30 Q 118 65 98 100 Q 140 100 160 65 Q 140 30 98 30 Z" fill="none" stroke="var(--accent-cyan)" stroke-width="3"/>
      
      <line x1="160" y1="65" x2="230" y2="65" stroke="var(--primary-color)" stroke-width="3"/>
      <text x="180" y="55" fill="var(--text-main)" font-size="12">A ⊕ B</text>

      <!-- Input C -->
      <text x="200" y="115" fill="var(--accent-cyan)" font-size="14" font-weight="bold">C</text>
      <line x1="220" y1="110" x2="250" y2="110" stroke="var(--primary-color)" stroke-width="3"/>
      
      <!-- AND / NAND Gate -->
      <path d="M 230 50 L 260 50 A 30 30 0 0 1 260 110 L 230 110 Z" fill="none" stroke="var(--accent-cyan)" stroke-width="3"/>
      <circle cx="295" cy="80" r="5" fill="none" stroke="var(--accent-cyan)" stroke-width="3"/>
      <line x1="300" y1="80" x2="340" y2="80" stroke="var(--primary-color)" stroke-width="3"/>
      <text x="350" y="85" fill="var(--accent-amber)" font-size="16" font-weight="bold">Y</text>
    </svg>`,
    options: [
      "\\( Y = (A \\oplus B) \\cdot C \\)",
      "\\( Y = \\overline{(A \\oplus B) \\cdot C} \\)",
      "\\( Y = (A + B) \\cdot \\overline{C} \\)",
      "\\( Y = \\overline{A \\oplus B \\oplus C} \\)"
    ],
    correctAnswer: 1,
    explanation: "1. Output of first gate is XOR of inputs A and B: \\( X = A \\oplus B \\).\n2. Second gate is a NAND gate taking \\( X \\) and \\( C \\) as inputs.\n3. Output \\( Y = \\overline{X \\cdot C} = \\overline{(A \\oplus B) \\cdot C} \\).",
    hint: "First find the output of the XOR gate, then invert the AND operation with input C."
  },
  {
    id: "ece_02",
    branch: "ece",
    topic: "Signals & Systems",
    difficulty: "advanced",
    question: "According to the Nyquist-Shannon Sampling Theorem, what is the minimum sampling frequency \\( f_s \\) required to avoid aliasing for a continuous signal with maximum bandwidth frequency \\( f_{max} = 15\\text{ kHz} \\)?",
    options: [
      "15 kHz",
      "22.5 kHz",
      "30 kHz",
      "60 kHz"
    ],
    correctAnswer: 2,
    explanation: "The Nyquist rate dictates that to perfectly reconstruct a bandlimited signal without spectral overlap (aliasing), the sampling frequency must be at least twice the maximum signal frequency:\n\n\\[ f_s \\ge 2 \\cdot f_{max} = 2 \\cdot 15\\text{ kHz} = 30\\text{ kHz} \\]",
    hint: "Nyquist frequency is equal to 2 times f_max."
  },

  // ==========================================
  // ENGINEERING MATHEMATICS (MATH)
  // ==========================================
  {
    id: "math_01",
    branch: "math",
    topic: "Linear Algebra",
    difficulty: "intermediate",
    question: "Calculate the determinant of the \\( 3 \\times 3 \\) matrix \\( A = \\begin{bmatrix} 2 & 0 & 1 \\\\ 3 & 4 & 2 \\\\ 0 & 1 & 5 \\end{bmatrix} \\).",
    options: [
      "31",
      "35",
      "37",
      "42"
    ],
    correctAnswer: 2,
    explanation: "Expand along the first row:\n\\[ \\det(A) = 2 \\cdot \\det\\begin{bmatrix} 4 & 2 \\\\ 1 & 5 \\end{bmatrix} - 0 + 1 \\cdot \\det\\begin{bmatrix} 3 & 4 \\\\ 0 & 1 \\end{bmatrix} \\]\n\\[ = 2(4 \\cdot 5 - 2 \\cdot 1) + 1(3 \\cdot 1 - 4 \\cdot 0) = 2(20 - 2) + 1(3) = 2(18) + 3 = 36 + 3 = 39 \\]\n\nWait, let's recheck:\n2 * (20 - 2) = 36.\n1 * (3 - 0) = 3.\n36 + 3 = 39.\nWait! Let's update the options so 39 is correct!",
    hint: "Expand along row 1: 2*(20-2) - 0 + 1*(3-0) = 39."
  },
  {
    id: "math_02",
    branch: "math",
    topic: "Calculus & Differential Equations",
    difficulty: "advanced",
    question: "Evaluate the definite integral \\( I = \\int_{0}^{\\pi/2} \\sin^3(x) \\cos(x) \\, dx \\).",
    options: [
      "\\( \\frac{1}{4} \\)",
      "\\( \\frac{1}{3} \\)",
      "\\( \\frac{1}{2} \\)",
      "\\( 1 \\)"
    ],
    correctAnswer: 0,
    explanation: "Use substitution \\( u = \\sin(x) \\), so \\( du = \\cos(x) dx \\).\n- When \\( x = 0 \\), \\( u = 0 \\).\n- When \\( x = \\pi/2 \\), \\( u = 1 \\).\n\n\\[ I = \\int_{0}^{1} u^3 \\, du = \\left[ \\frac{u^4}{4} \\right]_{0}^{1} = \\frac{1}{4} - 0 = \\frac{1}{4} \\]",
    hint: "Let u = sin(x), then du = cos(x) dx."
  }
];

// Fix math_01 option to contain 39
window.ENGINEERING_QUESTIONS.find(q => q.id === "math_01").options = ["31", "35", "39", "45"];
window.ENGINEERING_QUESTIONS.find(q => q.id === "math_01").correctAnswer = 2;

// Additional engineering questions for depth
window.ENGINEERING_QUESTIONS.push(
  {
    id: "cse_05",
    branch: "cse",
    topic: "Database Management Systems",
    difficulty: "intermediate",
    question: "Which Normal Form guarantees the elimination of partial functional dependencies (i.e. every non-key attribute must depend on the whole primary key)?",
    options: [
      "First Normal Form (1NF)",
      "Second Normal Form (2NF)",
      "Third Normal Form (3NF)",
      "Boyce-Codd Normal Form (BCNF)"
    ],
    correctAnswer: 1,
    explanation: "A relation is in 2NF if it is already in 1NF and no non-prime attribute is functionally dependent on any proper subset of any candidate key of the relation (no partial dependency).",
    hint: "2NF eliminates partial dependency on composite primary keys."
  },
  {
    id: "eee_04",
    branch: "eee",
    topic: "Electromagnetics",
    difficulty: "advanced",
    question: "Which of Maxwell's equations mathematically states that magnetic monopoles do not exist in nature?",
    options: [
      "\\( \\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0} \\)",
      "\\( \\nabla \\cdot \\mathbf{B} = 0 \\)",
      "\\( \\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t} \\)",
      "\\( \\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t} \\)"
    ],
    correctAnswer: 1,
    explanation: "Gauss's law for magnetism, \\( \\nabla \\cdot \\mathbf{B} = 0 \\), states that the divergence of magnetic flux density is zero everywhere. This implies magnetic field lines form continuous closed loops and isolated magnetic poles (monopoles) do not exist.",
    hint: "Look for the divergence of magnetic flux density equal to zero."
  },
  {
    id: "me_04",
    branch: "me",
    topic: "Kinematics of Machinery",
    difficulty: "beginner",
    question: "According to Grashof's law for a four-bar linkage mechanism, if \\( s \\) is the shortest link, \\( l \\) is the longest link, and \\( p, q \\) are intermediate links, what condition enables continuous relative rotation of at least one link?",
    options: [
      "\\( s + l \\le p + q \\)",
      "\\( s + l > p + q \\)",
      "\\( s + p = l + q \\)",
      "\\( s \\cdot l \\le p \\cdot q \\)"
    ],
    correctAnswer: 0,
    explanation: "Grashof's criterion states that for a planar 4-bar linkage, at least one link can perform a full 360-degree revolution relative to the ground if the sum of the shortest and longest link lengths is less than or equal to the sum of the remaining two link lengths: \\( s + l \\le p + q \\).",
    hint: "Shortest + Longest <= sum of remaining two."
  },
  {
    id: "ece_03",
    branch: "ece",
    topic: "Semiconductor Devices",
    difficulty: "beginner",
    question: "What is the approximate threshold (built-in) potential voltage \\( V_D \\) of a standard Silicon PN junction diode at room temperature (300K)?",
    options: [
      "0.3 V",
      "0.7 V",
      "1.1 V",
      "1.7 V"
    ],
    correctAnswer: 1,
    explanation: "At room temperature, the barrier potential for Silicon (Si) PN diodes is approximately **0.7V** (whereas for Germanium Ge diodes it is approx 0.3V).",
    hint: "Silicon diodes conduct heavily once forward voltage exceeds ~0.7 volts."
  }
);
