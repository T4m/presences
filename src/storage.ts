/* eslint-disable @typescript-eslint/no-explicit-any */
import localforage from 'localforage';
import type {Coach, Eleve} from "./types.ts";

export const storeEleves = localforage.createInstance({
    name: 'presenceDB',
    storeName: 'eleves',
});

export const storeUtils = localforage.createInstance({
    name: 'presenceDB',
    storeName: 'utils',
});

export const storePresences = localforage.createInstance({
    name: 'presenceDB',
    storeName: 'presences',
});

export const storeCoachs = localforage.createInstance({
    name: 'presenceDB',
    storeName: 'coachs',
})

export const storePresencesCoachs = localforage.createInstance({
    name: 'presenceDB',
    storeName: 'presencesCoachs',
});

// Fonction pour récupérer tous les élèves
export async function getAllEleves(): Promise<Eleve[]> {
    const eleves: Eleve[] = [];
    await storeEleves.iterate((value: Eleve) => {
        eleves.push(value);
    });
    return eleves;
}

export async function getAllCoachs(): Promise<Coach[]> {
    const coachs: Coach[] = [];
    await storeCoachs.iterate((value: Coach) => {
        coachs.push(value);
    });
    return coachs;
}

export async function getElevesMap(): Promise<Record<string, any>> {
    const eleves: Record<string, any> = {};
    await storeEleves.iterate((value: Record<string, any>) => {
        eleves[value.id] = value;
    });
    return eleves;
}

export async function getAllPresences(): Promise<Record<string, any>> {
    const presences: Record<string, any> = {};
    await storePresences.iterate((value: Record<string, any>, key: string) => {
        presences[key] = value;
    });
    return presences;
}

// Fonction pour créer un nouvel élève
export async function createEleve(prenom: string, nom?: string): Promise<Eleve> {
    const newId = (await storeUtils.getItem<number>('lastEleveId') || 0) + 1;
    const newEleve: Eleve = { id: newId.toString(), prenom, nom };
    await storeEleves.setItem(newEleve.id, newEleve);
    await storeUtils.setItem('lastEleveId', newId);
    return newEleve;
}

export async function createCoach(prenom: string): Promise<Coach> {
    const newId = (await storeUtils.getItem<number>('lastCoachId') || 0) + 1;
    const newCoach: Coach = { id: newId.toString(), prenom };
    await storeCoachs.setItem(newCoach.id, newCoach);
    await storeUtils.setItem('lastCoachId', newId);
    return newCoach;
}

async function doCreatePresence(id: string, date: string, cours: number, store: LocalForage) {
    // Format date to yyyy-mm-dd
    const dbKey = `${date}_${cours}`;

    const ids: string[] = await store.getItem<string[]>(dbKey) || [];
    // Si l'élève n'est pas déjà présent, on ajoute
    if (!ids.includes(id)) {
        ids.push(id);
        await store.setItem(dbKey, ids);
    }
    return ids;
}

export async function createPresence(eleveId: string, date: string, cours: number): Promise<string[]> {
    return doCreatePresence(eleveId, date, cours, storePresences);
}

export async function createPresenceCoach(coachId: string, date: string, cours: number): Promise<string[]> {
    return doCreatePresence(coachId, date, cours, storePresencesCoachs);
}

async function doGetByCourse(date: string, cours: number, storeA: LocalForage, storeB: LocalForage) {
    const dbKey = `${date}_${cours}`;
    const ids = await storeA.getItem<string[]>(dbKey);
    if (!ids || ids.length === 0) {
        return [];
    }
    const elementsPromises = ids.map(id => storeB.getItem<Eleve>(id));
    // Wait for all the promises to resolve
    const elements = await Promise.all(elementsPromises);
    // Filter out nulls (presence of non-existent eleve)
    return elements.filter((e): e is Eleve => !!e);
}

export async function getElevesByCourse(date: string, cours: number): Promise<Eleve[]> {
    return doGetByCourse(date, cours, storePresences, storeEleves)
}

export async function getCoachsByCourse(date: string, cours: number): Promise<Coach[]> {
    return doGetByCourse(date, cours, storePresencesCoachs, storeCoachs)
}

async function doRemovePresence(itemId: string, date: string, cours: number, store: LocalForage) {
    const dbKey = `${date}_${cours}`;
    let ids: string[] = await store.getItem<string[]>(dbKey) || [];
    ids = ids.filter(id => id !== itemId);
    await store.setItem(dbKey, ids);
    return ids;
}
export async function removePresence(eleveId: string, date: string, cours: number): Promise<string[]> {
    return doRemovePresence(eleveId, date, cours, storePresences);
}

export async function removePresenceCoach(coachId: string, date: string, cours: number): Promise<string[]> {
    return doRemovePresence(coachId, date, cours, storePresencesCoachs);
}

const stores = {
    eleves: storeEleves,
    utils: storeUtils,
    presences: storePresences,
    coachs: storeCoachs,
    presencesCoachs: storePresencesCoachs,
}

export async function backupAll(): Promise<Record<string, any>> {
    const backup: Record<string, any> = {};
    for (const [storeName, store] of Object.entries(stores)) {
        backup[storeName] = {};
        await store.iterate((value, key) => {
            backup[storeName][key] = value;
        });
    }
    return backup;
}
export async function restoreAll(backup: Record<string, any>): Promise<void> {
    for (const [storeName, entries] of Object.entries(backup)) {
        const instance = localforage.createInstance({
            name: "presenceDB",
            storeName,
        });

        // On efface tout avant de remettre
        await instance.clear();

        for (const [key, value] of Object.entries(entries)) {
            await instance.setItem(key, value);
        }
    }
}
