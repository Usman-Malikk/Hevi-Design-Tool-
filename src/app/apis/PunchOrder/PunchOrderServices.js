import { get, post, deleted } from "../index.js";

import { PunchOrderRoutes } from "./PunchOrder.Routes.js";
export const PunchOrderServices = {
  punchOrder: async (obj) => {
    const data = await post(PunchOrderRoutes.punchOrder, obj);
    return data
  },
}