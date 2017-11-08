external compareAsc : Js.Date.t -> Js.Date.t -> int = "" [@@bs.module "date-fns"]
external startOfHour : Js.Date.t -> Js.Date.t = "" [@@bs.module "date-fns"]
external isEqual : Js.Date.t -> Js.Date.t -> bool = "" [@@bs.module "date-fns"]

module Slot = struct 
  type t = {
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

  let current slots =
    List.filter (fun slot -> (
      let start = startOfHour (Js.Date.make ()) in
      isEqual start slot.start
    )) slots
end

type page = 
  | Loading
  | Floorplan of string option 
  | Upcoming 
  | Current 
  | Info

type msg =
  | InitializeSlots of Slot.t list
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
  slots: Slot.t list;
  rooms: Room.t list;
  page: page;
  menuVisible: bool;
}

let fetchSlots =
    Tea.Cmd.call (fun callbacks -> 
      Js.Promise.(
        Fetch.fetch "https://spreadsheets.google.com/feeds/list/1CEWwtmuycZFmvOR4nQIoT0r54OfxDguyFGBjRiCi3sg/od6/public/values?alt=json"
        |> then_ Fetch.Response.json
        |> then_ (fun json -> 
          !callbacks.enqueue (initializeSlots (Slot.decodeSlots json));
          resolve ()
        )
      ) |> ignore
    )

let init () = 
  ({
  page = Loading;
  menuVisible = false;
  rooms = [
    {
        name= "Lesse";
        color= "#dda8e8";
        x= 33.;
        y= 0.5;
        width=16.;
        height=9.;
    };
    {
        name= "LHomme";
        color= "#e2d3d4";
        x= 50.5;
        y= 1.5;
        width=18.5;
        height=9.;
    };
    {
        name= "Semois";
        color= "#bfb15d";
        x= 62.;
        y= 12.;
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
        color= "#3eaec7";
        x= 25.;
        y= 39.;
        width=16.;
        height=9.;
    };
    {
        name= "Cafeteria";
        color= "#e9eaa0";
        x= 37.;
        y= 51.;
        width=16.5;
        height=5.;
    };
    {
        name= "Sambre et Meuse";
        color= "#207c90";
        x= 6.;
        y= 88.;
        width=33.;
        height=9.;
    };
    {
        name= "Wamme";
        color= "#d87d10";
        x= 55.;
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
        x= 72.;
        y= 54.;
        width=16.;
        height=9.;
    };
    {
        name= "Ambleve";
        color= "#dcd07e";
        x= 63.;
        y= 91.;
        width=18.;
        height=8.;
    };
  ];
  slots = []
}, Tea.Cmd.batch [fetchSlots])

let safeFind f l = 
  try Some (List.find f l)
  with _ -> None

let update model = function 
  | InitializeSlots slots ->
    let page = 
      match model.page with
      | Loading -> if List.length (Slot.current slots) > 0 then Current else Upcoming
      | _ -> model.page
    in
    ({model with slots = slots; page}, Tea.Cmd.none)
  | ToggleMenu ->
    ({model with menuVisible = not model.menuVisible}, Tea.Cmd.none)
  | SetPage page ->
    let cmds = match page with
      | Current -> Tea.Cmd.batch [fetchSlots]
      | Upcoming -> Tea.Cmd.batch [fetchSlots]
      | Floorplan _ -> Tea.Cmd.batch [fetchSlots]
      | Loading -> Tea.Cmd.none
      | Info -> Tea.Cmd.none
    in
    ({model with page = page; menuVisible = false}, cmds)



let viewSlot withRoom slot =
  let module Html = Tea.Html in
  let twitterUrl =
    let twitter = slot.Slot.ownerTwitter in
    {j|https://twitter.com/$(twitter)|j}
  in
  let ownerInfo =
    match (slot.owner, slot.ownerTwitter) with
    | ("", "") -> Html.noNode
    | (ownerName, "") ->
      Html.span [] [Html.text {j|$(ownerName)|j}]
    | ("", ownerTwitter) ->
      Html.span [] [Html.a [Html.href twitterUrl] [Html.text ownerTwitter]]
    | (ownerName, ownerTwitter) ->
      Html.span [] [Html.text {j|$(ownerName) - |j}; Html.a [Html.href twitterUrl] [Html.text ownerTwitter]]
  in
  Html.div [Html.class' "content slot"] [
    Html.div [Html.class' "slot-header"] [
      Html.h2 [] [Html.text slot.name]; 
      ownerInfo;
    ];
    Html.div [Html.class' "slot-content"] [Html.text slot.description];
    Html.div [Html.class' "slot-footer"] [
      Html.div [] [Html.text (Js.Date.toLocaleString slot.start)];
      (if withRoom then Html.div [] [Html.a [Html.onClick (setPage (Floorplan (Some slot.roomName)))] [ Html.text slot.roomName]] else Html.noNode);
    ];
  ]

let viewUpcoming slots =
  let module Html = Tea.Html in
  let upComing = 
    List.filter (fun slot -> (compareAsc slot.Slot.start (Js.Date.make ())) > 0) slots
    |> List.sort (fun a b -> compareAsc a.Slot.start b.start) in
  Html.div [] [Html.div [] (List.map (viewSlot true) upComing) ]

let viewCurrent slots =
  let module Html = Tea.Html in
  match Slot.current slots with
  | [] -> 
    Html.div [Html.class' "content"] [
      Html.span [] [ Html.text "There are currently no active sessions." ];
      Html.span [] [ Html.br []; Html.text "Go to "];
      Html.a [Html.onClick (setPage Upcoming)] [Html.text "upcoming sessions"];
      Html.span [] [ Html.text " or the "];
      Html.a [Html.onClick (setPage (Floorplan None))] [Html.text "floorplan"];
      Html.span [] [Html.text " to view more."];
    ]
  | current -> 
    Html.div [Html.class' "content"] (List.map (viewSlot true) current)

let viewInfo =
  let module Html = Tea.Html in
  Html.div [Html.class' "content"] [
    Html.h1 [] [Html.text "Openspace info"];
    Html.h2 [] [Html.text "The first morning"];
    Html.span [] [Html.text "We expect you to join us at 09:00 for the introduction of the Market Place, and the opening of the Open Space. Find us at the conference room "];
    Html.a [Html.onClick (setPage (Floorplan (Some  "Sambre et Meuse")))] [Html.text "Sambre & Meuse"];
    Html.h2 [] [Html.text "Update the openspace"];
    Html.span [] [Html.text "You can update the slots of the openspace over "];
    Html.a [Html.href "https://docs.google.com/spreadsheets/d/1CEWwtmuycZFmvOR4nQIoT0r54OfxDguyFGBjRiCi3sg/edit?usp=sharing"] [Html.text "here"];
    Html.span [] [Html.text ". Please only update your own slots."];
    Html.h2 [] [Html.text "Wiki"];
    Html.span [] [
      Html.text "Looking for anything else, please check our ";
      Html.a [Html.href "https://github.com/socratesbe/socratesbe_17/wiki"] [Html.text "wiki"];
      Html.text "."
    ];
    Html.h2 [] [Html.text "Anything else?"];
    Html.span [] [
      Html.text "If you experience any problems at any time during the conference, please contact us at ";
      Html.br [];
      Html.a [Html.href "tel:+32 498 43 29 67"] [Html.text "+32 498 43 29 67 (Erik)"];
      Html.br [];
      Html.a [Html.href "+32 494 59 19 29"] [Html.text "+32 494 59 19 29 (Gien)"];
      Html.br [];
      Html.a [Html.href "+32 491 08 06 16"] [Html.text "+32 491 08 06 16 (Thomas)"];
      Html.br [];
      Html.a [Html.href "+32 495 69 17 32"] [Html.text "+32 495 69 17 32 (Koen)"];
      Html.br [];
      Html.a [Html.href "+32 84 21 94 11 "] [Html.text "+32 84 21 94 11 (Venue)"];
      Html.br [];
      Html.br [];
      Html.text "Any other questions about the conference?";
      Html.br [];
      Html.text "Drop us a mail (";
      Html.a [Html.href "mailto:info@scoratesbe.org"] [Html.text "info@socratesbe.org"];
      Html.text ") or join us on the #socrates_be channel on the international Software Crafters Slack (";
      Html.a [Html.href "https://softwarecrafters.slack.com/"] [Html.text "https://softwarecrafters.slack.com/"];
      Html.text ")."
    ]
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
    ];
  | Some room -> 
      let slots = List.filter (fun slot -> slot.Slot.roomName == room.Room.name) slots in
      Html.div [] [
        Html.h1 [] [Html.text room.Room.name];
        Html.div [] (viewSlots slots)
      ]

let viewFloorplan model roomOption =
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
    Svg.g [Tea.Html.onClick (setPage (Floorplan (Some room.Room.name)))] [
      Svg.rect [SvgA.x <$ room.Room.x; SvgA.y <$ room.y; SvgA.width <$ room.width; SvgA.height <$ room.height; SvgA.stroke "black"; SvgA.strokeWidth strokeWidth; SvgA.fill room.color; ] [];
      Svg.text' [SvgA.x <$ (room.Room.x +. 1.); SvgA.y <$ (room.y +. 3.); SvgA.alignmentBaseline "central"; SvgA.fontSize "14"] [Svg.text room.name]
    ]
  in
  Html.div [] [
    Html.div [] [
      Svg.svg [SvgA.width "100vw"; SvgA.height "69vh"; ] [
        Svg.svgimage [SvgA.xlinkHref "./floorplan.jpg"; SvgA.width "100vw"; SvgA.height "69vh"] [];
        Svg.text' [SvgA.x "5%"; SvgA.y "5%"; SvgA.fontSize "18"] [Svg.text "Level 1"];
        Svg.text' [SvgA.x "5%"; SvgA.y "78%"; SvgA.fontSize "18"] [Svg.text "Level 2"];
        Svg.g [] (List.map viewRoomCircle model.rooms)
      ];
    ];
    Html.div [Html.class' "info"] [viewSlotInfoForRoom model.slots activeRoom]
  ]

let viewLoading =
  Tea.Html.div [] [Tea.Html.text "Loading"]

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
    | Floorplan roomOption -> viewFloorplan model roomOption
    | Upcoming -> viewUpcoming model.slots
    | Current -> viewCurrent model.slots
    | Info -> viewInfo
    | Loading -> viewLoading
  in
  let viewContent =
    match model.menuVisible with
    | false -> 
      viewPage
    | true -> 
      Html.div [] [
        Html.ul [] [
          Html.li [] [ Html.a [Html.onClick (setPage Current) ] [ Html.text "Current sessions" ]];
          Html.li [] [ Html.a [Html.onClick (setPage Upcoming) ] [ Html.text "Upcoming sessions" ]];
          Html.li [] [ Html.a [Html.onClick (setPage (Floorplan None)) ] [ Html.text "Floorplan" ]];
          Html.li [] [ Html.a [Html.href "https://docs.google.com/spreadsheets/d/1CEWwtmuycZFmvOR4nQIoT0r54OfxDguyFGBjRiCi3sg/edit?usp=sharing" ] [ Html.text "Edit sessions" ]];
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