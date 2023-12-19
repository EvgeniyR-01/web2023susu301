var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
class FetchMenu {
  static loadItem(fetchTarget) {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield fetch(fetchTarget);
      const itemData = yield response.json();
      return itemData;
    });
  }
  static addItem(fetchTarget, itemData) {
    return __awaiter(this, void 0, void 0, function* () {
      fetch(fetchTarget, {
        method: 'POST',
        body: JSON.stringify(itemData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    });
  }
  static editItem(fetchTarget, itemData) {
    return __awaiter(this, void 0, void 0, function* () {
      fetch(fetchTarget, {
        method: 'PUT',
        body: JSON.stringify(itemData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    });
  }
  static deleteItem(fetchTarget) {
    return __awaiter(this, void 0, void 0, function* () {
      fetch(fetchTarget, {
        method: 'DELETE',
      });
    });
  }
  static loadAllItems(fetchTarget) {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield fetch(fetchTarget);
      const itemsData = yield response.json();
      console.log(itemsData);
      return itemsData;
    });
  }
  static editAllItems(fetchTarget, itemsData) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!fetchTarget.endsWith('/')) {
        fetchTarget = fetchTarget + '/';
      }
      itemsData.forEach((itemData) =>
        __awaiter(this, void 0, void 0, function* () {
          yield FetchMenu.editItem(fetchTarget + itemData.id.toString(), itemData);
        })
      );
    });
  }
  static deleteAllItems(fetchTarget, itemsData) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!fetchTarget.endsWith('/')) {
        fetchTarget = fetchTarget + '/';
      }
      itemsData.forEach((itemData) =>
        __awaiter(this, void 0, void 0, function* () {
          yield FetchMenu.deleteItem(fetchTarget + itemData.id.toString());
        })
      );
    });
  }
}
export default FetchMenu;
export {FetchMenu};
