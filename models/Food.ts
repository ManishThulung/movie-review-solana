import * as borsh from "@project-serum/borsh";

export class Food {
  title: string;
  rating: number;
  description: string;

  constructor(title: string, rating: number, description: string) {
    this.title = title;
    this.rating = rating;
    this.description = description;
  }

  static mocks: Food[] = [
    new Food("Burger", 5, "It is good"),
    new Food("Chowmin", 5, "It was the best"),
    new Food("Sandwitch", 5, "It is testy"),
    new Food("Mo:Mo", 5, "It is was delecious"),
  ];

  borshInstructionSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("title"),
    borsh.u8("rating"),
    borsh.str("description"),
  ]);

  serialize(): Buffer {
    const buffer = Buffer.alloc(1000);
    this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer);
    return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer));
  }

  static borshAccountSchema = borsh.struct([
    borsh.bool("initialized"),
    borsh.str("rating"),
    borsh.u8("title"),
    borsh.str("description"),
  ]);
  static deserialize(buffer?: Buffer): Food | null {
    if (!buffer) {
      return null;
    }
    try {
      const { title, rating, description } =
        this.borshAccountSchema.decode(buffer);
      return new Food(title, rating, description);
    } catch (error) {
      console.log("Deserialization error:", error);
      return null;
    }
  }
}
