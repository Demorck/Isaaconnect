export class BinaryString {
    result: string;
    binary_data: number[];
    object: any;

    bit_offset: number;

    static BYTE_SIZE = 8;

    constructor(object: any) {
        this.result = "";
        this.binary_data = [];
        this.object = object;
        this.bit_offset = 0;
    }

    public encode(): string {

        return Buffer.from(this.binary_data).toString("base64");
    }

    public pop_string()
    {
        const popped: number[] = [];
        let current_byte;
    }

    public pop_number()
    {

    }

    public pop_boolean()
    {

    }

    public add_string(value: string)
    {
        let buffer = Buffer.from(value);
        let array = Array.from(buffer.values());


        array.forEach((byte) => {
            this.add_number(byte, BinaryString.BYTE_SIZE);
        })

        this.add_number(0, BinaryString.BYTE_SIZE);
    }



    public add_number(value: number, size: number): void {
        let remaining = value;

        for (let i = 0; i < size; i++) {
            const current_value = remaining % 2 == 1;
            this.add_boolean(current_value);

            remaining = Math.floor(remaining / 2);
        }
    }

    public add_boolean(value: boolean): void
    {
        if (this.bit_offset > 0)
        {
            this.bit_offset--;

            if (value)
            {
                const last_index = this.binary_data.length - 1;
                const last_byte = this.binary_data[last_index];
                const new_value = 2 ** (BinaryString.BYTE_SIZE - this.bit_offset - 1);

                this.binary_data.push(last_byte + new_value);
            }
        } else {
            this.bit_offset = BinaryString.BYTE_SIZE - 1;
            this.binary_data.push(value ? 1 : 0);
        }
    }
}
