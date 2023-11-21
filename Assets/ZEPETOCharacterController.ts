
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter } from 'ZEPETO.Character.Controller';
import { WorldService } from 'ZEPETO.World';
import { Quaternion, Vector3 } from 'UnityEngine';

export default class CharacterController extends ZepetoScriptBehaviour {

    Start() {
        // Set Character Spawn Position
        const spawnInfo = new SpawnInfo();
        spawnInfo.position = new Vector3(5.706,10.44,14.888);
        // Set Character Spawn Rotation
        spawnInfo.rotation = Quaternion.Euler(0,-180,0);

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            const player: LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
            player.zepetoPlayer.character.gameObject.tag = "Player";
        });
        // Grab the user id specified from logging into zepeto through the editor.
        ZepetoPlayers.instance.CreatePlayerWithUserId(WorldService.userId, spawnInfo, true);
    }
}