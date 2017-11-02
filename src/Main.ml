type slot = {
  name: string;
  description: string;
  start: Js.Date.t;
  roomName: string;
}
let decodeFromGoogleSheets json =
  Json.Decode.{
    name = json |> at ["gsx$name"; "$t"] string;
    description = json |> at ["gsx$description"; "$t"] string;
    start = json |> at ["gsx$start"; "$t"] string |> Js.Date.fromString;
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
    x: float;
    y: float;
    width: float;
    height: float;
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
        color= "#ccbdcf";
        x= 30.;
        y= 2.;
        width=16.;
        height=9.;
    };
    {
        name= "LHomme";
        color= "#e2d3d4";
        x= 54.5;
        y= 6.;
        width=18.5;
        height=9.;
    };
    {
        name= "Semois";
        color= "#bfb15d";
        x= 61.;
        y= 13.;
        width=16.;
        height=9.;
    };
    {
        name= "Sambre";
        color= "#5555ff";
        x= 7.;
        y= 45.;
        width=16.;
        height=9.;
    };
    {
        name= "Meuse";
        color= "#d7b569";
        x= 33.;
        y= 41.;
        width=16.;
        height=9.;
    };
    {
        name= "Sambre et Meuse";
        color= "#3eaec7";
        x= 6.;
        y= 88.;
        width=33.;
        height=9.;
    };
    {
        name= "Wamme";
        color= "#d87d10";
        x= 50.;
        y= 50.;
        width=16.;
        height=9.;
    };
    {
        name= "Vesdre";
        color= "#d99367";
        x= 40.;
        y= 90.;
        width=16.;
        height=9.;
    };
    {
        name= "Ourthe";
        color= "#c1cac0";
        x= 65.;
        y= 56.;
        width=16.;
        height=9.;
    };
    {
        name= "Ambleve";
        color= "#dcd07e";
        x= 63.;
        y= 92.;
        width=18.;
        height=8.;
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
    ({model with data = slots}, Tea.Cmd.none)


let viewRoomCircle room =
  let module Svg = Tea.Svg in
  let module SvgA = Tea.Svg.Attributes in
  let module SvgE = Tea.Svg.Events in
  let (<$) a b = 
    let str = string_of_float b in
    a {j|$(str)%|j}
  in
  Svg.g [Tea.Html.onClick (activateRoom room.Room.name)] [
    Svg.rect [SvgA.x <$ room.Room.x; SvgA.y <$ room.y; SvgA.width <$ room.width; SvgA.height <$ room.height; SvgA.stroke "black"; SvgA.strokeWidth "1"; SvgA.fill room.color; ] [];
    Svg.text' [SvgA.x <$ (room.Room.x +. 1.); SvgA.y <$ (room.y +. 3.); SvgA.alignmentBaseline "central"; SvgA.fontSize "14"] [Svg.text room.name]

  ]

let viewSlotInfoForRoom slots room =
  let module Html = Tea.Html in
  let viewSlot slot =
    Html.div [Html.class' "slot"] [
      Html.div [Html.class' "slot-header"] [Html.h2 [] [Html.text slot.name]; Html.span [] [Html.text (Js.Date.toLocaleString slot.start)]];
      Html.span [] [Html.text slot.description];
    ]
  in
  let viewSlots slots =
    match slots with
    | [] -> [Html.div [] [Html.text "No slots booked for this room"]]
    | _ -> List.map viewSlot slots
  in
  match room with
  | None -> 
    Html.div [] [
      Html.h1 [] [Html.text "Click on a room to see the booked slots"];
      Html.p [] [
        Html.span [] [Html.text "Click "];
        Html.a [Html.href "https://docs.google.com/spreadsheets/d/1CEWwtmuycZFmvOR4nQIoT0r54OfxDguyFGBjRiCi3sg/edit?usp=sharing"] [Html.text "here"];
        Html.span [] [Html.text " to update the slots"];
      ] 
    ];
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
    [Html.class' ""] [
      Html.div [] [
        Html.div [] [
          Svg.svg [SvgA.width "100vw"; SvgA.height "69vh"; ] [
            Svg.svgimage [SvgA.xlinkHref "./floorplan.jpg"; SvgA.width "100vw"; SvgA.height "69vh"] [];
            Svg.g [] (List.map viewRoomCircle model.rooms)
          ];
        ];
        Html.div [Html.class' "info"] [viewSlotInfoForRoom model.data model.activeRoom]
      ];
    ]

let main =
  Tea.App.standardProgram {
    init;
    update;
    view;
    subscriptions = fun _ -> Tea.Sub.none
  }