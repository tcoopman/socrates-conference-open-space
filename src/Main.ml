open Tea.App

type msg =
  | ActivateRoom of string
  [@@bs.deriving {accessors}]

module Room = struct
  type t = {
    name: string;
    color: string;
    x: int;
    y: int;
  }
end

type slot = {
  name: string;
  description: string;
  start: int;
  until: int;
  roomName: string;
}
type model = {
  data: slot list;
  rooms: Room.t list;
  activeRoom: Room.t option;
}

let init () = {
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
  data = [
    {
      name= "Test";
      description= "Test description";
      start= 1;
      until= 1;
      roomName= "Lesse";
    };
  ]
}

let safeFind f l = 
  try Some (List.find f l)
  with _ -> None

let update model = function 
  | ActivateRoom roomName -> 
    let activeRoom = safeFind (fun room -> room.Room.name == roomName) model.rooms in
    {model with activeRoom = activeRoom}


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
  beginnerProgram {
    model = init ();
    update;
    view;
  }