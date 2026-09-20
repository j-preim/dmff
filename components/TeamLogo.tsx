import Image from "next/image";

export function TeamLogo({ src, name, size = 48 }: { src?: string; name: string; size?: number }) {
  if (!src) return <div className="team-logo-fallback" style={{ width: size, height: size }}>{name.slice(0, 2).toUpperCase()}</div>;
  return <Image className="team-logo" src={src} alt="" width={size} height={size} unoptimized />;
}
