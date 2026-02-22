import Grid from "../components/Grid";
import { getOeuvres } from "../lib/oeuvres";


export default async function Page({  }) {
    const oeuvres = (await getOeuvres()) ?? [];
    console.log(oeuvres)
    return (
        <div className="max-w-7xl mx-auto py-24">
            <Grid oeuvres={oeuvres}/>
        </div>
    );
}

function toDate(v) {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
}

function pickNextExpo(expos = []) {
    const now = new Date();
    const valid = expos
        .map((e) => ({ ...e, start: toDate(e.dateDebut), end: toDate(e.dateFin) }))
        .filter((e) => e.start);

    // en cours ou à venir
    return (
        valid
            .filter((e) => (e.end ? now <= e.end : now <= e.start))
            .sort((a, b) => a.start - b.start)[0] ?? null
    );
}
