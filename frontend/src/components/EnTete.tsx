"use client";

import type { Persona } from "@/lib/personas";

type Props = {
  persona?: Persona | null;
  onChangerDeRole?: () => void;
};

export function EnTete({ persona, onChangerDeRole }: Props) {
  return (
    <header className="hdr">
      <div className="hdr-in">
        <div className="mark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round">
            <path d="M3 12h4l3-8 4 16 3-8h4" />
          </svg>
        </div>
        <div className="ttl">Parc Sport dans la Ville</div>
        <div className="sp" />
        <span className="fictif">Données fictives</span>
        {persona && onChangerDeRole && (
          <button className="ctl" onClick={onChangerDeRole} title="Changer de profil">
            {persona.nom} · {persona.libelleRole}
          </button>
        )}
      </div>
    </header>
  );
}
