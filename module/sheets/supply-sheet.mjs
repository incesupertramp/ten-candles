/**
 * Ten Candles — Scheda per l'item "supply".
 */
const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

export class TenCandlesSupplySheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["ten-candles", "tc-item-sheet"],
    position: { width: 360, height: "auto" },
    form: { submitOnChange: true, closeOnSubmit: false },
    window: { contentClasses: ["tc-item-content"] }
  };

  static PARTS = {
    form: { template: "systems/ten-candles/templates/item/supply-sheet.hbs" }
  };

  /** @override */
  async _prepareContext() {
    return {
      item: this.item,
      system: this.item.system,
      editable: this.isEditable
    };
  }
}
