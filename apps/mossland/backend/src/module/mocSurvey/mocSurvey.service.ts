import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LoadService, ObjectId, Id, Account } from "@shared/util-server";
import { UserService } from "../user/user.service";
import * as gql from "../gql";
import * as MocSurvey from "./mocSurvey.model";
import * as srv from "../srv";
import * as db from "../db";
import { types } from "@platform/data-access";

@Injectable()
export class MocSurveyService extends LoadService<MocSurvey.Mdl, MocSurvey.Doc, MocSurvey.Input> {
  private mmoc: db.shared.Thing.Doc;
  constructor(
    @InjectModel(MocSurvey.name)
    private readonly MocSurvey: MocSurvey.Mdl,
    private readonly userService: UserService,
    private readonly keyringService: srv.shared.KeyringService,
    private readonly thingService: srv.shared.ThingService
  ) {
    super(MocSurveyService.name, MocSurvey);
  }
  async onModuleInit() {
    this.mmoc = await this.thingService.generate("MMOC");
  }

  async generateMocSurvey(data: gql.MocSurveyInput) {
    const user = await this.userService.get(data.creator as Id);
    if (!user.hasItem(this.mmoc._id, 1)) throw new Error("Does not own MMOC");
    return await this.MocSurvey.create({ ...data, thing: this.mmoc._id });
  }
  async openMocSurvey(mocSurveyId: Id, keyring: Id) {
    const mocSurvey = await this.MocSurvey.pickById(mocSurveyId);
    const user = await this.userService.get(mocSurvey.creator);
    // if (user.keyring._id !== keyring) throw new Error("Different User");
    if (mocSurvey.status !== "active") throw new Error("Unable to Open");
    return await mocSurvey.merge({ status: "opened" }).save();
  }
  async respondMocSurvey(mocSurveyId: Id, response: gql.platform.UserSurveyResponseInput, keyring: Id) {
    const mocSurvey = await this.MocSurvey.pickById(mocSurveyId);
    const user = await this.userService.get(response.user);
    if (!user.keyring.equals(keyring)) throw new Error("Different User");
    else if (mocSurvey.openAt.getTime() > Date.now() || mocSurvey.closeAt.getTime() < Date.now())
      throw new Error("MocSurvey is Not Opened in Time");

    return await mocSurvey.addResponse({ ...response, num: user.item(this.mmoc._id).num }).save();
  }
  async closeMocSurvey(mocSurveyId: Id) {
    const mocSurvey = await this.MocSurvey.pickById(mocSurveyId);
    if (mocSurvey.closeAt.getTime() > Date.now()) throw new Error("MocSurvey is Not in Close Time");
    const users = await this.userService.list(mocSurvey.getResponseUsers());
    const snapshot: gql.platform.MocOwnership[] = users.map((user) => ({
      user: user._id,
      num: user.item(this.mmoc._id).num,
    }));
    return await mocSurvey.close(snapshot).save();
  }
  async update(mocSurveyId: Id, data: gql.MocSurveyInput) {
    const mocSurvey = await this.MocSurvey.pickById(mocSurveyId);
    if (mocSurvey.status !== "active") throw new Error("Opened MocSurvey cannot be Modified");
    return await mocSurvey.merge(data).save();
  }
}
