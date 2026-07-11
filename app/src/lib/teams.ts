export type Team = {
  code: string;
  name: string;
  flag: string;
  primary: string;
  secondary: string;
};

export const TEAMS: Team[] = [
  { code: "ARG", name: "Argentina", flag: "🇦🇷", primary: "#75AADB", secondary: "#FFFFFF" },
  { code: "BRA", name: "Brazil", flag: "🇧🇷", primary: "#FFDC02", secondary: "#009B3A" },
  { code: "FRA", name: "France", flag: "🇫🇷", primary: "#21304D", secondary: "#EF4135" },
  { code: "ENG", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", primary: "#FFFFFF", secondary: "#CF081F" },
  { code: "ESP", name: "Spain", flag: "🇪🇸", primary: "#C60B1E", secondary: "#FFC400" },
  { code: "GER", name: "Germany", flag: "🇩🇪", primary: "#FFFFFF", secondary: "#000000" },
  { code: "POR", name: "Portugal", flag: "🇵🇹", primary: "#A50021", secondary: "#006600" },
  { code: "NED", name: "Netherlands", flag: "🇳🇱", primary: "#F36C21", secondary: "#21468B" },
  { code: "BEL", name: "Belgium", flag: "🇧🇪", primary: "#E30613", secondary: "#FDDA24" },
  { code: "CRO", name: "Croatia", flag: "🇭🇷", primary: "#FF0000", secondary: "#FFFFFF" },
  { code: "URU", name: "Uruguay", flag: "🇺🇾", primary: "#55B5E5", secondary: "#000000" },
  { code: "MEX", name: "Mexico", flag: "🇲🇽", primary: "#006847", secondary: "#CE1126" },
  { code: "USA", name: "United States", flag: "🇺🇸", primary: "#FFFFFF", secondary: "#1F2742" },
  { code: "CAN", name: "Canada", flag: "🇨🇦", primary: "#E31837", secondary: "#FFFFFF" },
  { code: "JPN", name: "Japan", flag: "🇯🇵", primary: "#12264D", secondary: "#E60012" },
  { code: "KOR", name: "South Korea", flag: "🇰🇷", primary: "#E6002D", secondary: "#0B090C" },
  { code: "AUS", name: "Australia", flag: "🇦🇺", primary: "#FFB81C", secondary: "#00594F" },
  { code: "KSA", name: "Saudi Arabia", flag: "🇸🇦", primary: "#006C35", secondary: "#FFFFFF" },
  { code: "IRN", name: "Iran", flag: "🇮🇷", primary: "#FFFFFF", secondary: "#DA0000" },
  { code: "QAT", name: "Qatar", flag: "🇶🇦", primary: "#8A1538", secondary: "#FFFFFF" },
  { code: "MAR", name: "Morocco", flag: "🇲🇦", primary: "#C1272D", secondary: "#006233" },
  { code: "SEN", name: "Senegal", flag: "🇸🇳", primary: "#FFFFFF", secondary: "#00853F" },
  { code: "GHA", name: "Ghana", flag: "🇬🇭", primary: "#FFFFFF", secondary: "#CE1126" },
  { code: "NGA", name: "Nigeria", flag: "🇳🇬", primary: "#008751", secondary: "#FFFFFF" },
  { code: "CMR", name: "Cameroon", flag: "🇨🇲", primary: "#007A5E", secondary: "#CE1126" },
  { code: "ECU", name: "Ecuador", flag: "🇪🇨", primary: "#FFD100", secondary: "#034EA2" },
  { code: "COL", name: "Colombia", flag: "🇨🇴", primary: "#FCD116", secondary: "#003893" },
  { code: "CHI", name: "Chile", flag: "🇨🇱", primary: "#D52B1E", secondary: "#0039A6" },
  { code: "SUI", name: "Switzerland", flag: "🇨🇭", primary: "#D52B1E", secondary: "#FFFFFF" },
  { code: "DEN", name: "Denmark", flag: "🇩🇰", primary: "#C60C30", secondary: "#FFFFFF" },
  { code: "POL", name: "Poland", flag: "🇵🇱", primary: "#FFFFFF", secondary: "#DC143C" },
  { code: "ITA", name: "Italy", flag: "🇮🇹", primary: "#0066B2", secondary: "#FFFFFF" },
  { code: "NOR", name: "Norway", flag: "🇳🇴", primary: "#EF2B2D", secondary: "#002868" },
];

const byCode = new Map(TEAMS.map((t) => [t.code, t]));

export function getTeam(code: string): Team {
  return (
    byCode.get(code) ?? {
      code,
      name: code,
      flag: "🏳️",
      primary: "#00FF87",
      secondary: "#FFFFFF",
    }
  );
}
