/**
 * Ten Candles — Supply / equipment item (con quantità e consumo).
 */
export class SupplyData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const f = foundry.data.fields;
    return {
      quantity: new f.NumberField({ initial: 1, min: 0, integer: true, nullable: false }),
      consumable: new f.BooleanField({ initial: true }),
      notes: new f.StringField({ initial: "", blank: true })
    };
  }
}
