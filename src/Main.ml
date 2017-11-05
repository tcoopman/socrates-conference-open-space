external compareAsc : Js.Date.t -> Js.Date.t -> int = "" [@@bs.module "date-fns"]
external startOfHour : Js.Date.t -> Js.Date.t = "" [@@bs.module "date-fns"]
external isEqual : Js.Date.t -> Js.Date.t -> bool = "" [@@bs.module "date-fns"]

type slot = {
  name: string;
  description: string;
  start: Js.Date.t;
  roomName: string;
  owner: string;
  ownerTwitter: string;
}
let decodeFromGoogleSheets json =
  Json.Decode.{
    name = json |> at ["gsx$name"; "$t"] string;
    description = json |> at ["gsx$description"; "$t"] string;
    start = json |> at ["gsx$start"; "$t"] string |> Js.Date.fromString;
    roomName = json |> at ["gsx$roomname"; "$t"] string;
    owner = json |> at ["gsx$owner"; "$t"] string;
    ownerTwitter = json |> at ["gsx$ownertwitter"; "$t"] string;
  }

let decodeSlots json =
  let slots = Json.Decode.(
    json |> at ["feed"; "entry"] (array decodeFromGoogleSheets);
  )
  in
  slots |> Array.to_list

type page = Map of string option | Upcoming | Current | Info

type msg =
  | InitializeSlots of slot list
  | ToggleMenu
  | SetPage of page
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
  page: page;
  menuVisible: bool;
}

let init () = 
  let initCmds =
    Tea.Cmd.call (fun callbacks -> 
      Js.Promise.(
        (* Fetch.fetch "https://spreadsheets.google.com/feeds/list/1CEWwtmuycZFmvOR4nQIoT0r54OfxDguyFGBjRiCi3sg/od6/public/values?alt=json" *)
        Fetch.fetch "/dev_app.json"
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
  page = Map None;
  menuVisible = false;
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
  | InitializeSlots slots ->
    ({model with data = slots}, Tea.Cmd.none)
  | ToggleMenu ->
    ({model with menuVisible = not model.menuVisible}, Tea.Cmd.none)
  | SetPage page ->
    ({model with page = page; menuVisible = false}, Tea.Cmd.none)



let viewSlot withRoom slot =
  let module Html = Tea.Html in
  let twitterUrl =
    let twitter = slot.ownerTwitter in
    {j|https://twitter.com/$(twitter)|j}
  in
  Html.div [Html.class' "slot"] [
    Html.div [Html.class' "slot-header"] [
      Html.h2 [] [Html.text slot.name]; 
      Html.div [Html.class' "slot-extra-info"] [
        Html.span [] [Html.text (Js.Date.toLocaleString slot.start)];
        (if withRoom then Html.span [] [Html.a [Html.onClick (setPage (Map (Some slot.roomName)))] [ Html.text slot.roomName]] else Html.noNode);
        Html.span [] [Html.text slot.owner];
        Html.span [] [Html.a [Html.href twitterUrl ] [Html.text slot.ownerTwitter]];
      ];
    ];
    Html.div [] [Html.text slot.description];
    Html.div [] [
    ];
  ]


let viewUpcoming slots =
  let module Html = Tea.Html in
  let upComing = 
    List.filter (fun slot -> (compareAsc slot.start (Js.Date.make ())) > 0) slots
    |> List.sort (fun a b -> compareAsc a.start b.start) in
  Html.div [] [Html.div [] (List.map (viewSlot true) upComing) ]

let viewCurrent slots =
  let module Html = Tea.Html in
  let current =
    List.filter (fun slot -> (
      let start = startOfHour (Js.Date.make ()) in
      isEqual start slot.start
    )) slots
  in
  Html.div [] [Html.div [] (List.map (viewSlot true) current) ]

let viewInfo =
  let module Html = Tea.Html in
  Html.div [] [
    Html.div [] [
      Html.h1 [] [Html.text "Openspace info"];
      Html.h2 [] [Html.text "The first morning"];
      Html.span [] [Html.text "We expect you to join us at 09:00 for the introduction of the Market Place, and the opening of the Open Space. Find us at the conference room "];
      Html.a [Html.onClick (setPage (Map (Some  "Sambre et Meuse")))] [Html.text "Sambre & Meuse"];
      Html.h2 [] [Html.text "Update the openspace"];
      Html.a [Html.href "https://docs.google.com/spreadsheets/d/1CEWwtmuycZFmvOR4nQIoT0r54OfxDguyFGBjRiCi3sg/edit?usp=sharing"] [Html.text "here"];
    ];
    Html.div [] [
      Html.h1 [] [Html.text "Update the openspace"];
      Html.a [Html.href "https://docs.google.com/spreadsheets/d/1CEWwtmuycZFmvOR4nQIoT0r54OfxDguyFGBjRiCi3sg/edit?usp=sharing"] [Html.text "here"];
    ];
    Html.div [] [Html.text "Link to wiki"] ;
    Html.div [] [Html.text "Phone numbers"] ;
    Html.div [] [Html.text "Regular info"] ;
  ]

let viewSlotInfoForRoom slots room =
  let module Html = Tea.Html in
  let viewSlots slots =
    match slots with
    | [] -> [Html.div [] [Html.text "No slots booked for this room"]]
    | _ -> List.map (viewSlot false) slots
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

let viewMap model roomOption =
  let module Html = Tea.Html in
  let module Svg = Tea.Svg in
  let module SvgA = Tea.Svg.Attributes in
  let activeRoom = Js.Option.andThen 
    (fun [@bs] roomName -> safeFind (fun room -> room.Room.name == roomName) model.rooms)
    roomOption
  in
  let viewRoomCircle room =
    let module SvgE = Tea.Svg.Events in
    let (<$) a b = 
      let str = string_of_float b in
      a {j|$(str)%|j}
    in
    let strokeWidth =
      match activeRoom with
        | Some name when name == room -> "2.5"
        | _ -> "1"
    in
    Svg.g [Tea.Html.onClick (setPage (Map (Some room.Room.name)))] [
      Svg.rect [SvgA.x <$ room.Room.x; SvgA.y <$ room.y; SvgA.width <$ room.width; SvgA.height <$ room.height; SvgA.stroke "black"; SvgA.strokeWidth strokeWidth; SvgA.fill room.color; ] [];
      Svg.text' [SvgA.x <$ (room.Room.x +. 1.); SvgA.y <$ (room.y +. 3.); SvgA.alignmentBaseline "central"; SvgA.fontSize "14"] [Svg.text room.name]
    ]
  in
  Html.div [] [
    Html.div [] [
      Svg.svg [SvgA.width "100vw"; SvgA.height "69vh"; ] [
        Svg.svgimage [SvgA.xlinkHref "./floorplan.jpg"; SvgA.width "100vw"; SvgA.height "69vh"] [];
        Svg.g [] (List.map viewRoomCircle model.rooms)
      ];
    ];
    Html.div [Html.class' "info"] [viewSlotInfoForRoom model.data activeRoom]
  ]


let view model =
  let module Html = Tea.Html in
  let viewHamburger =
    let class' = if model.menuVisible then "open" else "" in
    Html.div [Html.id "hamburger"; Html.class' class'; Html.onClick toggleMenu] [
      Html.span [] [];
      Html.span [] [];
      Html.span [] [];
    ]
  in
  let viewPage =
    match model.page with
    | Map roomOption -> viewMap model roomOption
    | Upcoming -> viewUpcoming model.data
    | Current -> viewCurrent model.data
    | Info -> viewInfo
  in
  let viewContent =
    match model.menuVisible with
    | false -> 
      viewPage
    | true -> 
      Html.div [] [
        Html.ul [] [
          Html.li [] [ Html.a [Html.onClick (setPage Current) ] [ Html.text "Current" ]];
          Html.li [] [ Html.a [Html.onClick (setPage Upcoming) ] [ Html.text "Upcoming" ]];
          Html.li [] [ Html.a [Html.onClick (setPage (Map None)) ] [ Html.text "OpenSpace Map" ]];
          Html.li [] [ Html.a [Html.onClick (setPage Info) ] [ Html.text "Info" ]];
        ]
      ]
  in
  Html.div
    [Html.class' ""] [
      Html.div [Html.class' "hero"] [
        Html.h1 [] [Html.text "Socrates Be OpenSpace"];
        viewHamburger
      ];
      viewContent;
    ]

let main =
  Tea.App.standardProgram {
    init;
    update;
    view;
    subscriptions = fun _ -> Tea.Sub.none
  }