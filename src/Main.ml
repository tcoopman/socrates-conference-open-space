type slot = {
  name: string;
  description: string;
  start: string;
  until: string;
  roomName: string;
}
let decodeFromGoogleSheets json =
  Json.Decode.{
    name = json |> at ["gsx$name"; "$t"] string;
    description = json |> at ["gsx$description"; "$t"] string;
    start = json |> at ["gsx$start"; "$t"] string;
    until = json |> at ["gsx$until"; "$t"] string;
    roomName = json |> at ["gsx$roomname"; "$t"] string;
  }

let decodeSlots json =
  let slots = Json.Decode.(
    json |> at ["feed"; "entry"] (array decodeFromGoogleSheets);
  )
  in
  slots |> Array.to_list
type msg =
  | ActivateRoom of string
  | InitializeSlots of slot list
  [@@bs.deriving {accessors}]

module Room = struct
  type t = {
    name: string;
    color: string;
    x: int;
    y: int;
  }

end

type model = {
  data: slot list;
  rooms: Room.t list;
  activeRoom: Room.t option;
}

let init () = 
  let initCmds =
    Tea.Cmd.call (fun callbacks -> 
      Js.Promise.(
        Fetch.fetch "https://spreadsheets.google.com/feeds/list/1CEWwtmuycZFmvOR4nQIoT0r54OfxDguyFGBjRiCi3sg/od6/public/values?alt=json"
        |> then_ Fetch.Response.json
        |> then_ (fun json -> 
          Js.log json;
          !callbacks.enqueue (initializeSlots (decodeSlots json));
          resolve ()
        )
      ) |> ignore
    )
  in
  ({
  activeRoom = None;
  rooms = [
    {
        name= "Lesse";
        color= "pink";
        x= 310;
        y= 220;
    };
    {
        name= "LHomme";
        color= "red";
        x= 340;
        y= 250;
    };
    {
        name= "Semois";
        color= "blue";
        x= 490;
        y= 310;
    };
  ];
  data = []
}, Tea.Cmd.batch [initCmds])

let safeFind f l = 
  try Some (List.find f l)
  with _ -> None

let update model = function 
  | ActivateRoom roomName -> 
    let activeRoom = safeFind (fun room -> room.Room.name == roomName) model.rooms in
    ({model with activeRoom = activeRoom}, Tea.Cmd.none)
  | InitializeSlots slots ->
    Js.log slots;
    ({model with data = slots}, Tea.Cmd.none)


let viewRoomCircle room =
  let module Svg = Tea.Svg in
  let module SvgA = Tea.Svg.Attributes in
  let module SvgE = Tea.Svg.Events in
  let (<$) a b = a (string_of_int b) in
  Svg.circle [SvgA.cx <$ room.Room.x; SvgA.cy <$ room.y; SvgA.r "10"; SvgA.stroke "black"; SvgA.strokeWidth "1"; SvgA.fill room.color; Tea.Html.onClick (activateRoom room.name)] []

let viewSlotInfoForRoom slots room =
  let module Html = Tea.Html in
  let viewSlot slot =
    Html.div [] [
      Html.div [] [Html.text slot.name];
      Html.div [] [Html.text slot.description];
    ]
  in
  let viewSlots slots =
    match slots with
    | [] -> [Html.div [] [Html.text "No slots booked for this room"]]
    | _ -> List.map viewSlot slots
  in
  match room with
  | None -> Html.div [] [Html.text "Click on a room to see the booked slots"];
  | Some room -> 
      let slots = List.filter (fun slot -> slot.roomName == room.Room.name) slots in
      Html.div [] [
        Html.h1 [] [Html.text room.Room.name];
        Html.div [] (viewSlots slots)
      ]

let view model =
  let module Html = Tea.Html in
  let module Svg = Tea.Svg in
  let module SvgA = Tea.Svg.Attributes in
  Html.div
    [Html.class' "grid"] [
      Html.div [] [
        Svg.svg [SvgA.width "650px"; SvgA.height "800px"] [
          Svg.svgimage [SvgA.xlinkHref "/floorplan.jpg"; SvgA.width "100%"; SvgA.height "100%"] [];
          Svg.g [] (List.map viewRoomCircle model.rooms)
        ];
      ];
      Html.div [] [viewSlotInfoForRoom model.data model.activeRoom]
    ]

let main =
  Tea.App.standardProgram {
    init;
    update;
    view;
    subscriptions = fun _ -> Tea.Sub.none
  }