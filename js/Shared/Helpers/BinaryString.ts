class BinaryString {
    binaryData: number[];
    bitOffset: number;
  
    static BYTE_SIZE = 8;
  
    constructor(binaryData: number[] = [], bitOffset = 0) {
      this.binaryData = binaryData;
      this.bitOffset = bitOffset;
    }
  
    static fromBase64(base64String: string): BinaryString {
      const binaryData = BinaryString._base64ToBinary(base64String);
      return new BinaryString(binaryData);
    }
  
    toBase64(): string {
      return BinaryString._binaryToBase64(this.binaryData, this.bitOffset);
    }
  
    popString(): string {
      const poppedBytes: number[] = [];
      let currentByte: number;
  
      while ((currentByte = this.popNumber(BinaryString.BYTE_SIZE)) !== 0) {
        poppedBytes.push(currentByte);
      }
  
      return BinaryString._binaryToString(poppedBytes);
    }
  
    popBoolean(): boolean {
      const firstByte = this.binaryData[0];
  
      if (firstByte === undefined) {
        throw new Error('Tried to pop when the binary data was empty');
      }
  
      const poppedBoolean = firstByte % 2 === 1;
  
      if (this.bitOffset < BinaryString.BYTE_SIZE - 1) {
        this.binaryData[0] = Math.floor(firstByte / 2);
        this.bitOffset += 1;
      } else {
        this.binaryData.shift();
        this.bitOffset = 0;
      }
  
      return poppedBoolean;
    }
  
    popNumber(numBits: number): number {
      let result = 0;
      let currentMultiplier = 1;
  
      for (let i = 0; i < numBits; i += 1) {
        const currentBit = this.popBoolean();
        if (currentBit) {
          result += currentMultiplier;
        }
        currentMultiplier *= 2;
      }
  
      return result;
    }
  
    addString(stringValue: string): void {
      const bytesToAdd = BinaryString._stringToBinary(stringValue);
  
      bytesToAdd.forEach((byte) => this.addNumber(byte, BinaryString.BYTE_SIZE));
  
      this.addNumber(0, BinaryString.BYTE_SIZE);
    }
  
    addBoolean(booleanValue: boolean): void {
      if (this.bitOffset > 0) {
        this.bitOffset -= 1;
  
        if (booleanValue) {
          const lastByte = this.binaryData[this.binaryData.length - 1];
          const newValue = 2 ** (BinaryString.BYTE_SIZE - this.bitOffset - 1);
  
          this.binaryData[this.binaryData.length - 1] = lastByte + newValue;
        }
      } else {
        this.binaryData.push(booleanValue ? 1 : 0);
        this.bitOffset = BinaryString.BYTE_SIZE - 1;
      }
    }
  
    addNumber(numberValue: number, numBits: number): void {
      let remainingValue = numberValue;
  
      for (let i = 0; i < numBits; i += 1) {
        const currentValue = remainingValue % 2 === 1;
        this.addBoolean(currentValue);
  
        remainingValue = Math.floor(remainingValue / 2);
      }
    }
  
    static _base64ToBinary(base64String: string): number[] {
      const binaryString = atob(base64String);
      const binaryArray: number[] = [];
  
      for (let i = 0; i < binaryString.length; i++) {
        binaryArray.push(binaryString.charCodeAt(i));
      }
  
      return binaryArray;
    }
  
    static _binaryToBase64(binaryArray: number[], bitOffset: number): string {
      let binaryDataToLoad = binaryArray;
      if (bitOffset === 0) {
        binaryDataToLoad = [...binaryArray, 0];
      }
  
      const binaryString = String.fromCharCode(...binaryDataToLoad);
      return btoa(binaryString);
    }
  
    static _stringToBinary(utf8String: string): number[] {
      const encoder = new TextEncoder();
      return Array.from(encoder.encode(utf8String));
    }
  
    static _binaryToString(binaryArray: number[]): string {
      const decoder = new TextDecoder();
      return decoder.decode(new Uint8Array(binaryArray));
    }
  }
  
  export default BinaryString;
  