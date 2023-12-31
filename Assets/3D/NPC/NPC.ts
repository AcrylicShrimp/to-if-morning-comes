import {
  AnimationClip,
  GameObject,
  HumanBodyBones,
  Vector3,
  WaitForSeconds,
} from "UnityEngine";
import { SpawnInfo, ZepetoPlayers } from "ZEPETO.Character.Controller";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";

import NPCBubbleText from "./NPCBubbleText";
import NPCBubbleTextProvider from "./NPCBubbleTextProvider";
import GlobalCoroutineManager from "../../Loading Screen/GlobalCoroutineManager";

export default class NPC extends ZepetoScriptBehaviour {
  @Header("Configuration")
  @SerializeField()
  private zepetoId: string;
  @Header("Animation")
  @SerializeField()
  private animation: AnimationClip;
  @Header("Dialogue")
  @SerializeField()
  private dialogueHeightOffset: number;
  @SerializeField()
  private dialogues: string[];

  public Start(): void {
    const spawnInfo = new SpawnInfo();
    spawnInfo.position = this.transform.position;
    spawnInfo.rotation = this.transform.rotation;

    const id = `__NPC__${this.zepetoId}_${Math.random()}`;

    ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId) => {
      if (sessionId !== id) return;
      if (!ZepetoPlayers.instance.HasPlayer(sessionId)) return;

      const player = ZepetoPlayers.instance.GetPlayer(sessionId);
      player.character.transform.SetParent(this.transform, false);
      player.character.transform.localPosition = Vector3.zero;
      player.character.transform.localEulerAngles = Vector3.zero;

      if (this.animation)
        GlobalCoroutineManager.Instance.RunAfter(3, () => {
          player.character.SetGesture(this.animation);
        });

      if (this.dialogues.length) {
        const bubbleTextObject = GameObject.Instantiate<GameObject>(
          NPCBubbleTextProvider.Instance.NPCBubbleText,
          player.character.transform,
          false
        );
        bubbleTextObject.transform.position =
          player.character.ZepetoAnimator.GetBoneTransform(HumanBodyBones.Head)
            .position +
          Vector3.op_Multiply(Vector3.up, this.dialogueHeightOffset);
        this.StartCoroutine(
          this.PresentDialogues(bubbleTextObject.GetComponent<NPCBubbleText>())
        );
      }
    });

    ZepetoPlayers.instance.CreatePlayerWithZepetoId(
      id,
      this.zepetoId,
      spawnInfo,
      false
    );
  }

  private *PresentDialogues(bubbleText: NPCBubbleText) {
    let dialogueIndex = 0;

    for (;;) {
      yield new WaitForSeconds(1 + Math.random() * 2);
      bubbleText.ShowDialogue(this.dialogues[dialogueIndex]);
      dialogueIndex = (dialogueIndex + 1) % this.dialogues.length;
      yield new WaitForSeconds(5);
      bubbleText.HideDialogue();
    }
  }
}
