import { post, get, deleted } from "../index.js";
import { DraftOrderRoutes } from "./DraftOrder.Routes";

export const DraftOrderServices = {
  saveOrder: async (Data) => {
    const result = await post(DraftOrderRoutes.SaveDraft, Data);
    if (result.status === 200) {
      return result.data;
    } else throw result;
  },
  getDraftOrders: async () => {
    const result = await get(DraftOrderRoutes.getDraftOrders);
    if (result.status === 200) {
      return result.data;
    } else {
      throw result;
    }
  },
  deleteDraftOrder: async (id) => {
    const result = await deleted(DraftOrderRoutes.deleteOrder + id);
    if (result.status === 200) {
      return result.data;
    } else {
      throw result;
    }
  },
  updateDraftOrderById: async (id, Data) => {
    const result = await post(DraftOrderRoutes.updateDraftOrder + id, Data);
    if (result.status === 200) {
      return result.data;
    } else {
      throw result;
    }
  },
};
