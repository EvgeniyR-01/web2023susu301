class FetchMenu {
  public static async loadItem(fetchTarget: string): Promise<any> {
    const response = await fetch(fetchTarget);
    const itemData = await response.json();
    return itemData;
  }

  public static async addItem(fetchTarget: string, itemData: any): Promise<void> {
    fetch(fetchTarget, {
      method: 'POST',
      body: JSON.stringify(itemData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  public static async editItem(fetchTarget: string, itemData: any): Promise<void> {
    fetch(fetchTarget, {
      method: 'PUT',
      body: JSON.stringify(itemData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  public static async deleteItem(fetchTarget: string): Promise<void> {
    fetch(fetchTarget, {
      method: 'DELETE',
    });
  }

  public static async loadAllItems(fetchTarget: string): Promise<any[]> {
    const response = await fetch(fetchTarget);
    const itemsData = await response.json();
    console.log(itemsData);
    return itemsData;
  }

  public static async editAllItems(fetchTarget: string, itemsData: any[]): Promise<void> {
    if (!fetchTarget.endsWith('/')) {
      fetchTarget = fetchTarget + '/';
    }
    itemsData.forEach(async (itemData) => {
      await FetchMenu.editItem(fetchTarget + itemData.id.toString(), itemData);
    });
  }

  public static async deleteAllItems(fetchTarget: string, itemsData: any[]): Promise<void> {
    if (!fetchTarget.endsWith('/')) {
      fetchTarget = fetchTarget + '/';
    }
    itemsData.forEach(async (itemData) => {
      await FetchMenu.deleteItem(fetchTarget + itemData.id.toString());
    });
  }
}

export default FetchMenu;
export {FetchMenu};
