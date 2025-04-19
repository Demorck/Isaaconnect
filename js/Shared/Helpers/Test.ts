export type Options = {
    health: number; // 8 bits
    enabled_blind: boolean;
    numer_blind: number; // 8 bits
    count_names: number; // 8 bits
    count_ids: number; // 8 bits
    names: string[]; // length = count_names
    ids: number[]; // length = count_ids * count_names, 16 bits each because there are more than 256 items.
};

function encodeOptions(opt: Options): Uint8Array {
    const bytes: number[] = [];

    bytes.push(opt.health & 0xFF);
    bytes.push(opt.enabled_blind ? 0b10000000 : 0); // 1 bit en MSB
    bytes.push(opt.numer_blind & 0xFF);
    bytes.push(opt.count_names & 0xFF);
    bytes.push(opt.count_ids & 0xFF);


    for (const name of opt.names) {
        const encoded = new TextEncoder().encode(name);
        if (encoded.length > 255) throw new Error("String too long");
        bytes.push(encoded.length);
        bytes.push(...encoded);
    }


    for (const id of opt.ids) {
        bytes.push((id >> 8) & 0xFF);
        bytes.push(id & 0xFF);
    }

    return new Uint8Array(bytes);
}


function toBase64url(uint8: Uint8Array): string {
    return btoa(String.fromCharCode(...uint8))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function fromBase64url(b64: string): Uint8Array {
    const base64 = b64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const bin = atob(padded);
    return new Uint8Array([...bin].map(c => c.charCodeAt(0)));
}



function decodeOptions(data: Uint8Array): Options {
    let i = 0;

    const health = data[i++];
    const enabled_blind = (data[i++] & 0b10000000) !== 0;
    const numer_blind = data[i++];
    const count_names = data[i++];
    const count_ids = data[i++];

    const names: string[] = [];
    for (let j = 0; j < count_names; j++) {
        const len = data[i++];
        const nameBytes = data.slice(i, i + len);
        names.push(new TextDecoder().decode(nameBytes));
        i += len;
    }

    const ids: number[] = [];
    for (let j = 0; j < count_ids; j++) {
        const high = data[i++];
        const low = data[i++];
        ids.push((high << 8) | low);
    }

    return {
        health,
        enabled_blind,
        numer_blind,
        count_names,
        count_ids,
        names,
        ids
    };
}

export { encodeOptions, toBase64url, fromBase64url, decodeOptions };