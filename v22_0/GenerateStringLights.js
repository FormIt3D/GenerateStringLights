// set up namespaces
if (typeof FormItPlugins == 'undefined')
{
    FormItPlugins = {};
}
if (typeof FormItPlugins.GenerateStringLights == 'undefined')
{
    FormItPlugins.GenerateStringLights = {};
}

/*** web/UI code - runs natively in the plugin process ***/

// IDs of input elements that need to be referenced or updated
let fixtureCountInputID = 'fixtureCountInput';
let bulbsPerFixtureInputID = 'bulbsPerFixtureInput';
let bulbRadiusInputID = 'bulbRadiusInput';
let cableOrHousingHeightInputID = 'cableOrHousingHeightInput';
let cableOrHousingRadiusInputID = 'cableOrHousingRadiusInput';
let catenaryCableFacetCountInputID = 'catenaryCableFacetCountInput';
let catenaryCableRadiusInputID = 'catenaryCableRadiusInput';
let catenaryCableBulgeInputID = 'catenaryCableBulgeInput';

FormItPlugins.GenerateStringLights.initializeUI = async function()
{
    // create an overall container for all objects that comprise the "content" of the plugin
    // everything except the footer
    let contentContainer = document.createElement('div');
    contentContainer.id = 'contentContainer';
    contentContainer.className = 'contentContainer'
    contentContainer.style.overflowY = 'scroll';
    window.document.body.appendChild(contentContainer);

    // create the header
    contentContainer.appendChild(new FormIt.PluginUI.HeaderModule('Generate String Lights', 'Generate string (or festoon) lighting along a path.').element);

    // unordered lists as necessary
    let detailsUl1 = contentContainer.appendChild(document.createElement('ul'));
    let detailsLi1 = detailsUl1.appendChild(document.createElement('li'));
    detailsLi1.innerHTML = 'Select a line or an arc to generate string lights along';
    let detailsLi2 = detailsUl1.appendChild(document.createElement('li'));
    detailsLi2.innerHTML = 'Set the desired options, then click the button below';

    // create the fixture properties subheader
    let fixturePropertiesSubheader = contentContainer.appendChild(document.createElement('p'));
    fixturePropertiesSubheader.style = 'font-weight: bold;'
    fixturePropertiesSubheader.innerHTML = 'Fixture Properties';

    // create the fixture count input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('Number of Fixtures: ', 'fixtureCountModule', 'inputModuleContainer', fixtureCountInputID).element);
    document.getElementById(fixtureCountInputID).value = 6;

    // create the bulbs per fixture input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('Bulbs per Fixture: ', 'fixtureCountModule', 'inputModuleContainer', bulbsPerFixtureInputID).element);
    document.getElementById(bulbsPerFixtureInputID).value = 1;

    // create the bulb radius input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('Bulb Radius: ', 'cableOrHousingRadiusModule', 'inputModuleContainer', bulbRadiusInputID, FormIt.PluginUI.convertValueToDimensionString).element);
    document.getElementById(bulbRadiusInputID).value = await FormIt.StringConversion.LinearValueToString(0.1667);

    // create the fixture cable/housing height input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('Housing Height: ', 'cableOrHousingHeightModule', 'inputModuleContainer', cableOrHousingHeightInputID, FormIt.PluginUI.convertValueToDimensionString).element);
    document.getElementById(cableOrHousingHeightInputID).value = await FormIt.StringConversion.LinearValueToString(0.08333);

    // create the fixture cable/housing radius input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('Housing Radius: ', 'cableOrHousingRadiusModule', 'inputModuleContainer', cableOrHousingRadiusInputID, FormIt.PluginUI.convertValueToDimensionString).element);
    document.getElementById(cableOrHousingRadiusInputID).value = await FormIt.StringConversion.LinearValueToString(0.0625);

    // create the curve properties subheader
    let curvePropertiesSubheader = contentContainer.appendChild(document.createElement('p'));
    curvePropertiesSubheader.style = 'font-weight: bold;'
    curvePropertiesSubheader.innerHTML = 'Catenary Curve Properties';

    // create the curve facet count input
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('Curve Facets: ', 'fixtureCountModule', 'inputModuleContainer', catenaryCableFacetCountInputID).element);
    document.getElementById(catenaryCableFacetCountInputID).value = 16;

    // create the catenary cable radius input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('Cable Radius: ', 'catenaryCableRadiusModule', 'inputModuleContainer', catenaryCableRadiusInputID, FormIt.PluginUI.convertValueToDimensionString).element);
    document.getElementById(catenaryCableRadiusInputID).value = await FormIt.StringConversion.LinearValueToString(0.0208333333);

    // create the cable bulge input element
    contentContainer.appendChild(new FormIt.PluginUI.TextInputModule('Arc Bulge (new arcs only): ', 'catenaryCableBulgeModule', 'inputModuleContainer', catenaryCableBulgeInputID, FormIt.PluginUI.convertValueToDimensionString).element);
    document.getElementById(catenaryCableBulgeInputID).value = await FormIt.StringConversion.LinearValueToString(2);

    // create the button to execute the generation
    contentContainer.appendChild(new FormIt.PluginUI.Button('Generate String Lights', FormItPlugins.GenerateStringLights.execute).element);

    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);
}

FormItPlugins.GenerateStringLights.updateUI = async function()
{
    // set the dimension inputs to use the current units
    
    // bulb radius input
    document.getElementById(bulbRadiusInputID).value = await FormIt.StringConversion.LinearValueToString((await FormIt.StringConversion.StringToLinearValue(document.getElementById(bulbRadiusInputID).value)).second);

    // cable/housing height input
    document.getElementById(cableOrHousingHeightInputID).value = await FormIt.StringConversion.LinearValueToString((await FormIt.StringConversion.StringToLinearValue(document.getElementById(cableOrHousingHeightInputID).value)).second);

    // cable/housing radius input
    document.getElementById(cableOrHousingRadiusInputID).value = await FormIt.StringConversion.LinearValueToString((await FormIt.StringConversion.StringToLinearValue(document.getElementById(cableOrHousingRadiusInputID).value)).second);

    // catenary cable radius input
    document.getElementById(catenaryCableRadiusInputID).value = await FormIt.StringConversion.LinearValueToString((await FormIt.StringConversion.StringToLinearValue(document.getElementById(catenaryCableRadiusInputID).value)).second);

    // catenary cable bulge input
    document.getElementById(catenaryCableBulgeInputID).value = await FormIt.StringConversion.LinearValueToString((await FormIt.StringConversion.StringToLinearValue(document.getElementById(catenaryCableBulgeInputID).value)).second);
}

/*** application code - runs asynchronously from plugin process to communicate with FormIt ***/

// global operation type
let operationType;

// the current editing history
let nHistoryID;

// the current history depth
let historyDepth;

// the current selection
let currentSelection;

// all the arrays
FormItPlugins.GenerateStringLights.arrays = {};

//if set to false, we hit an error and need to terminate gracefully
let success;

// get the current history, query the selection, and report the number of items successfully selected
FormItPlugins.GenerateStringLights.getSelectionBasics = async function()
{
    //console.log("\nGetting selection basics...");
    // get current history
    nHistoryID = await FormIt.GroupEdit.GetEditingHistoryID();
    //console.log("\nCurrent history: " + JSON.stringify(nHistoryID));

    // get current selection
    currentSelection = await FormIt.Selection.GetSelections();
    //console.log("Current selection: " + JSON.stringify(currentSelection));
    //console.log("Number of objects in selection: " + currentSelection.length);

    if (currentSelection.length === 0)
    {
        let message = "Select a line or an arc to generate string lights along.";
        await FormIt.UI.ShowNotification(message, FormIt.NotificationType.Information, 0);
        console.log("\n" + message);
        return false;
    }
    else
    {
        return true;
    }
}

// create an array of objectIDs from a given selection
FormItPlugins.GenerateStringLights.getObjectIDsBySelection = function(currentSelection)
{
    // create or empty the objectID array
    FormItPlugins.GenerateStringLights.arrays.nObjectIDArray = new Array();

    // for each object in the selection, get info
    for (let j = 0; j < currentSelection.length; j++)
    {
        // if you're not in the Main History, calculate the depth to extract the correct history data
        historyDepth = (currentSelection[j]["ids"].length) - 1;

        // get objectID of the current selection, then push the results into an array
        let nObjectID = currentSelection[j]["ids"][historyDepth]["Object"];
        //console.log("Selection ID: " + nObjectID);

        FormItPlugins.GenerateStringLights.arrays.nObjectIDArray.push(nObjectID);
    }
    
    // return the filled array of object IDs
    return FormItPlugins.GenerateStringLights.arrays.nObjectIDArray;
}

// create an array of objectIDs by looking for the geometry that changed in this history
FormItPlugins.GenerateStringLights.getIDsByCreatedChangedOrDeletedDataInHistory = async function(nHistoryID, type, createdOrChanged)
{
    // create or empty the objectID array
    FormItPlugins.GenerateStringLights.arrays.nObjectIDArray = new Array();

    // find the geometry that was just changed
    let createdOrChangedData = await WSM.APIGetCreatedChangedAndDeletedInActiveDeltaReadOnly(nHistoryID, type);
    //console.log("Created/changed/deleted data: " + JSON.stringify(createdOrChangedData));

    // return different data depending on whether "created" or "changed" was requested
    if (createdOrChanged == "created")
    {
        FormItPlugins.GenerateStringLights.arrays.nObjectIDArray = createdOrChangedData["created"];
        //console.log("Created data array: " + deanstein.GenerateStringLights.arrays.nObjectIDArray );
    }
    else if (createdOrChanged == "changed")
    {
        FormItPlugins.GenerateStringLights.arrays.nObjectIDArray  = createdOrChangedData["changed"];
        //console.log("Changed data array: " + deanstein.GenerateStringLights.arrays.nObjectIDArray );
    }

    // return the filled array of object IDs
    return FormItPlugins.GenerateStringLights.arrays.nObjectIDArray;
}

// define how to gather necessary data about the selection and store it in arrays
FormItPlugins.GenerateStringLights.getInfoByIDs = async function(nHistoryID, objectIDArray)
{
    // create or empty the arrays before starting
    FormItPlugins.GenerateStringLights.arrays.typeArray = new Array();
    FormItPlugins.GenerateStringLights.arrays.nVertexIDArray = new Array();
    FormItPlugins.GenerateStringLights.arrays.nVertexIDUniqueArray = new Array();
    FormItPlugins.GenerateStringLights.arrays.point3DArray = new Array();
    FormItPlugins.GenerateStringLights.arrays.bIsEdgeTypeArray = new Array();
    FormItPlugins.GenerateStringLights.arrays.edgeLengthArray = new Array();
    FormItPlugins.GenerateStringLights.arrays.arcCircleAnalysisArray = new Array();
    FormItPlugins.GenerateStringLights.arrays.bIsOnCircleArray = new Array();
    FormItPlugins.GenerateStringLights.arrays.bIsOnSplineArray = new Array();
    FormItPlugins.GenerateStringLights.arrays.siblingArray = new Array();
    FormItPlugins.GenerateStringLights.arrays.arcCircle3PointIDArray = new Array();
    FormItPlugins.GenerateStringLights.arrays.arcCircle3PointPosArray = new Array();

    // selections must contain only edges
    let validType = WSM.nObjectType.nEdgeType;

    // for each object, get info
    for (let j = 0; j < objectIDArray.length; j++)
    {
        // get objectID of this element
        let nObjectID = objectIDArray[j];
        //console.log("This object ID: " + nObjectID);

        // get object type, then push the results into an array
        let nType =  await WSM.APIGetObjectTypeReadOnly(nHistoryID, nObjectID);
        //console.log("Object type: " + nType);
        FormItPlugins.GenerateStringLights.arrays.typeArray.push(nType);
        //console.log("Object type array: " + deanstein.GenerateStringLights.arrays.typeArray);
        
        // get vertexIDs, then push the results into an array
        let nVertexIDSet = await WSM.APIGetObjectsByTypeReadOnly(nHistoryID, nObjectID, WSM.nObjectType.nVertexType, false);
        //console.log("nVertex ID: " + nVertexIDSet);
        FormItPlugins.GenerateStringLights.arrays.nVertexIDArray.push(nVertexIDSet);
        //console.log("VertexID array: " + FormItPlugins.GenerateStringLights.arrays.nVertexIDArray);

        // convert vertexIDs on each end of the line to point3Ds, then push the results into an array
        let point3D0 = await WSM.APIGetVertexPoint3dReadOnly(nHistoryID, FormItPlugins.GenerateStringLights.arrays.nVertexIDArray[j][0]);
        let point3D1 = await WSM.APIGetVertexPoint3dReadOnly(nHistoryID, FormItPlugins.GenerateStringLights.arrays.nVertexIDArray[j][1]);
        FormItPlugins.GenerateStringLights.arrays.point3DArray.push(point3D0);
        FormItPlugins.GenerateStringLights.arrays.point3DArray.push(point3D1);
        //console.log("Point3D array: " + JSON.stringify(deanstein.GenerateStringLights.arrays.point3DArray));

        async function getArcCircleAnalysis() 
        {
            // test selection for arc/circle attributes, then push the results into array
            let arcCircleAnalysis = await WSM.APIIsEdgeOnCircleReadOnly(nHistoryID, nObjectID);
            //console.log("Report results of arc/circle analysis: " + JSON.stringify(arcCircleAnalysis));
            let bIsOnCircle = arcCircleAnalysis["bHasCircleAttribute"];
            //console.log("Is selection part of a circle? " + arcCircleAnalysis["bHasCircleAttribute"]);
            FormItPlugins.GenerateStringLights.arrays.bIsOnCircleArray.push(bIsOnCircle);
            FormItPlugins.GenerateStringLights.arrays.arcCircleAnalysisArray.push(arcCircleAnalysis);
            return arcCircleAnalysis;
        }

        let arcCircleAnalysis = await getArcCircleAnalysis();

        async function getSplineAnalysis()
        {
            // test for spline attributes, then push the results into an array
            let splineAnalysis = await WSM.APIIsEdgeOnSplineReadOnly(nHistoryID, nObjectID);
            let bIsOnSpline = splineAnalysis["bHasSplineAttribute"];
            FormItPlugins.GenerateStringLights.arrays.bIsOnSplineArray.push(bIsOnSpline);
        }

        let splineAnalysis = await getSplineAnalysis();

        // determine which siblings the current edge has, then push the results into an array
        let currentSiblings = "[" + arcCircleAnalysis["aAllCircleSiblings"] + "]";
        //console.log("Current sibling IDs: " + currentSiblings);
        FormItPlugins.GenerateStringLights.arrays.siblingArray.push(currentSiblings);
    }

    // for each object added to the typeArray, check whether the type matches the desired type (edges) and create a new array of boolean values
    function createSelectionTypeArray()
    {
        for (let m = 0; m < FormItPlugins.GenerateStringLights.arrays.typeArray.length; m++)
        {
            if (FormItPlugins.GenerateStringLights.arrays.typeArray[m] === validType)
            {
                FormItPlugins.GenerateStringLights.arrays.bIsEdgeTypeArray.push(true);
            }
            else 
            {
                FormItPlugins.GenerateStringLights.arrays.bIsEdgeTypeArray.push(false);
            }
        }
        //console.log("Is valid array: " + deanstein.GenerateStringLights.arrays.bIsEdgeTypeArray);
    }

    createSelectionTypeArray();
}

// define how to pre-check to determine whether we can proceed with the given selection set
FormItPlugins.GenerateStringLights.preCheck = async function(args)
{
    let bIsSelectionValid = true;

    // if the type array is empty, nothing was selected, and this is an invalid selection
    if (!FormItPlugins.GenerateStringLights.arrays.typeArray)
    {
        bIsSelectionValid = false;
    }

    //console.log("\nStart selection precheck... \n");

    // TEST if selection contains only edges
    let bIsSelectionEdgeTypeOnly = booleanReduce(FormItPlugins.GenerateStringLights.arrays.bIsEdgeTypeArray);
    //console.log("TEST: Is selection set edges only? " + bIsSelectionEdgeTypeOnly);
    if (bIsSelectionEdgeTypeOnly === false)
    {
        let message = "Can't generate string lights given the selected geometry. \nSelect a single arc or a line, and try again.";
        await FormIt.UI.ShowNotification(message, FormIt.NotificationType.Error, 0);
        console.log(message);

        return false;
    }

    // determine the operation type
    let operationType = FormItPlugins.GenerateStringLights.getOperationType(args);
    let bIsOperationTypeValid = true;
    let precheckPassed = true;

    // if the operation type is a line, we first need to make an arc from scratch, then select it
    if (operationType === "line") 
    {
        console.log("\nOperation type detected: line");
        bIsOperationTypeValid = true;
    }

    // a line with 0 arcBulge is valid too, but will get treated differently downstream (no automatic rebuild)
    if (operationType === "lineNoBulge")
    {
        console.log("\nOperation type detected: line with 0 resulting bulge");
        bIsOperationTypeValid = true;
    }

    // if the operation is an arc or circle, do some more digging to determine which type exactly
    if (operationType === "arcCircle")
    {
        console.log("\nOperation type detected: arc/circle");

        // run the function to populate arrays with unique vertices, if they exist
        FormItPlugins.GenerateStringLights.getUniqueVertexIDArray(FormItPlugins.GenerateStringLights.arrays.nVertexIDArray);

        // check if the current vertexIDs in the array form a circle, and set the flag appropriately
        bCircle = FormItPlugins.GenerateStringLights.checkIfCircle(FormItPlugins.GenerateStringLights.arrays.nVertexIDUniqueArray);

        // if the operation is a circle, throw an error because this isn't supported yet
        if (bCircle === true) 
        {
            let message = "Circles aren't supported yet. \nSelect an arc or a line, and try again.";
            await FormIt.UI.ShowNotification(message, FormIt.NotificationType.Error, 0);
            console.log(message);
            bIsOperationTypeValid = false;
        }

        // otherwise, this is an arc and we can proceed
        else 
        {
            bIsOperationTypeValid = true;
        }
    }

    // if the operation is a spline, throw an error because this isn't supported yet
    if (operationType === "spline")
    {
        console.log("\nOperation type detected: spline");

        let message = "Splines aren't supported yet. \nSelect an arc or a line, and try again.";
        await FormIt.UI.ShowNotification(message, FormIt.NotificationType.Error, 0);
        console.log(message);

        bIsOperationTypeValid = false;
    }

    // check if all required tests pass
    if (bIsSelectionValid && bIsSelectionEdgeTypeOnly && bIsOperationTypeValid) 
    {
        preCheckPassed = true;
        console.log("\nPrecheck passed! \n");
    }
    else
    {
        preCheckPassed = false;
        console.log("\nPrecheck failed. \n");
    }

    return preCheckPassed;
}

// define how to determine the type of operation to proceed with
FormItPlugins.GenerateStringLights.getOperationType = function(args) 
{
    // TEST if the entire selection has the circle attribute
    let bIsArcCircleType = booleanReduce(FormItPlugins.GenerateStringLights.arrays.bIsOnCircleArray);
    //console.log("bIsOnCirclArray: " + deanstein.GenerateStringLights.arrays.bIsOnCircleArray);

    // TEST if the entire selection has the spline attribute
    let bIsSplineType = booleanReduce(FormItPlugins.GenerateStringLights.arrays.bIsOnSplineArray);

    // get the specified arc bulge
    let arcBulge = args.arcBulge;

    if (bIsArcCircleType === true)
    {
        operationType = "arcCircle";
    }

    else if (bIsArcCircleType === true)
    {
        operationType = "arcCircle";
    }

    else if (bIsSplineType === true)
    {
        operationType = "spline";
    }

    else if (arcBulge === 0)
    {
        operationType = "lineNoBulge";
    }

    else
    {
        operationType = "line";
    }

    //console.log("Operation type: " + operationType);
    return operationType;
}

// define how to generate a new arc from the selected line
FormItPlugins.GenerateStringLights.createCatenaryArcFromLine = async function(nHistoryID, args)
{
    //console.log("\nCreating a catenary arc from line");
    let arcStartPos = FormItPlugins.GenerateStringLights.arrays.point3DArray[0];
    //console.log("Arc start point: " + JSON.stringify(arcStartPos));

    let arcEndPos = FormItPlugins.GenerateStringLights.arrays.point3DArray[1];
    //console.log("Arc end point: " + JSON.stringify(arcEndPos));

    let x0 = arcStartPos["x"];
    let y0 = arcStartPos["y"];
    let z0 = arcStartPos["z"];

    let x1 = arcEndPos["x"];
    let y1 = arcEndPos["y"];
    let z1 = arcEndPos["z"];

    // midpoint function is stored in utils
    let midPoint = getMidPointBetweenTwoPoints(x0,y0,z0,x1,y1,z1);

    let arcBulge = args.arcBulge;

    // assume gravity is down, and subtract the desired arc bulge from the z-value of the current midpoint
    let newMidPointZ = midPoint[2] - arcBulge;

    // define the bulge point as the midpoint with the new z value
    let bulgePoint = [midPoint[0], midPoint[1], newMidPointZ];

    // create a point 3D at the bulge point
    let thirdPoint = await WSM.Geom.Point3d(bulgePoint[0], bulgePoint[1], bulgePoint[2]);
    //console.log("Third point: " + JSON.stringify(thirdPoint));

    // set parameters for initial catenary arc
    let accuracyORcount = 5;
    let bReadOnly = false;
    let trans;
    let nMinimumNumberOfFacets = 5;
    bCircle = false;

    // create a new arc
    let catenaryArcFromLine = await WSM.APICreateCircleOrArcFromPoints(nHistoryID, arcStartPos, arcEndPos, thirdPoint, accuracyORcount, bReadOnly, trans, nMinimumNumberOfFacets, bCircle);
    console.log("Created a new arc based on the input line.");

    // get the changed data and fill out the object ID array with the data
    let createdDataIDs = await FormItPlugins.GenerateStringLights.getIDsByCreatedChangedOrDeletedDataInHistory(nHistoryID, WSM.nObjectType.nEdgeType, "created");

    if (catenaryArcFromLine.length === 0)
    {
        console.log("\nError: no new arc was created.");
        success = false;
        return;
    }

    // re-run the get info routine to populate the arrays with the new curve information
    await FormItPlugins.GenerateStringLights.getInfoByIDs(nHistoryID, createdDataIDs);
    //console.log("\nPopulating arrays with new selection info.");

    //console.log("\nNew curve available for rebuild.");
    return FormItPlugins.GenerateStringLights.arrays.nVertexIDArray;
}

// define how to check if the vertexIDs form a circle; returns true if circle
FormItPlugins.GenerateStringLights.checkIfCircle = function(nVertexIDUniqueArray)
{
    // first, flatten the array
    // this function is stored in utils
    let nVertexIDUniqueArrayFlattened = flattenArray(nVertexIDUniqueArray);

    // if any unique values were found, this is an arc
    if (nVertexIDUniqueArrayFlattened.length > 0)
    {
        bCircle = false;
        console.log("Determined this curve is not a circle.\n");
        return bCircle;
    }
    
    // otherwise, this is a full circle
    else
    {
        bCircle = true;
        console.log("Determined this curve is a full circle.\n");
        return bCircle;
    }
}

// define how to flatten and return unique values in an array
FormItPlugins.GenerateStringLights.getUniqueVertexIDArray = function(nVertexIDArray)
{
    // first, flatten the vertex ID array
    // this function is stored in utils
    let nVertexIDArrayFlattened = flattenArray(nVertexIDArray);
    //console.log("Flattened nVertexID array: " + nVertexIDArrayFlattened);

    // take the flattened ID array and remove duplicates. 
    // if this is an arc, this will return two end points. if not, it will return nothing.
    // this function is stored in utils
    let nVertexIDUniqueArray = getUniqueValuesInArray(nVertexIDArrayFlattened);

    // push the unique vertexIDs into an array
    FormItPlugins.GenerateStringLights.arrays.nVertexIDUniqueArray.push(nVertexIDUniqueArray);

    return nVertexIDUniqueArray;
}

// define how to get 3 points defining the arc or circle
FormItPlugins.GenerateStringLights.getArcCircle3PointPosArray = async function()
{
    //console.log("\nGetting 3 points to define the current arc or circle...\n");

    // set the vertex IDs for rebuild to the current vertexIDArray in selection
    let vertexIDArrayForRebuild = FormItPlugins.GenerateStringLights.arrays.nVertexIDArray;

    let edgeCount = currentSelection.length;
    //console.log("Edges selected: " + (vertexIDArrayForRebuild.length));

    let nVertexIDUniqueArray = FormItPlugins.GenerateStringLights.getUniqueVertexIDArray(vertexIDArrayForRebuild);

    let arcStartPosID;
    let arcStartPos;
    let arcEndPosID;
    let arcEndPos;

    // if this is a circle, we have to pick the end points differently to ensure they are distinct
    if (bCircle === true)
    {
        // not going to support this case, yet. for now, this is stopped at the precheck
        // TODO: if a circle, allow choosing down or "out" for light directions
    }

    // otherwise, we're working with an arc, so figure out the end points
    else if (bCircle === false)
    {
        // get the ID of the first vertex of the first edge in the array
        arcStartPosID = nVertexIDUniqueArray[0];
        //console.log("Start point vertexID: " + arcStartPosID);

        // get the point3D equivalent
        arcStartPos = await WSM.APIGetVertexPoint3dReadOnly(nHistoryID, arcStartPosID);
        //console.log("Start point point3D: " + JSON.stringify(arcStartPos));

        // get the ID of the last vertex of the last edge in the array
        arcEndPosID = nVertexIDUniqueArray[1];
        //console.log("End point vertexID: " + arcEndPosID);

        // get the point3D equivalent
        arcEndPos = await WSM.APIGetVertexPoint3dReadOnly(nHistoryID, arcEndPosID);
        //console.log("End point point 3D: " + JSON.stringify(arcEndPos));
    }

    // get the third point: a point on or near the midpoint of the arc, at a segment vertex
    //console.log("nVertexIDArray: " + deanstein.GenerateStringLights.arrays.nVertexIDArray);
    let thirdPointID = vertexIDArrayForRebuild[Math.ceil(edgeCount / 2)][0];
    //console.log("Third point vertexID: " + JSON.stringify(thirdPointID));

    // get the point3D equivalent
    let thirdPointPos = await WSM.APIGetVertexPoint3dReadOnly(nHistoryID, thirdPointID);
    //console.log("Third point 3D: " + JSON.stringify(thirdPointPos));

    // push the three points into the appropriate array
    FormItPlugins.GenerateStringLights.arrays.arcCircle3PointIDArray.push(arcStartPosID, thirdPointID, arcEndPosID);
    FormItPlugins.GenerateStringLights.arrays.arcCircle3PointPosArray.push(arcStartPos, thirdPointPos, arcEndPos);
}

// define how to rebuild the given arc/circle
FormItPlugins.GenerateStringLights.rebuildArcCircle = async function(vertexIDArrayForRebuild, args)
{
    console.log("\nBegin rebuild of arc or circle...");

    // this function is stored in utils
    let nVertexIDArrayFlattened = flattenArray(vertexIDArrayForRebuild);

    // get the 3 points representing the arc or circle
    await FormItPlugins.GenerateStringLights.getArcCircle3PointPosArray();

    let arcStartPos = FormItPlugins.GenerateStringLights.arrays.arcCircle3PointPosArray[0];
    let thirdPointPos = FormItPlugins.GenerateStringLights.arrays.arcCircle3PointPosArray[1];
    let arcEndPos = FormItPlugins.GenerateStringLights.arrays.arcCircle3PointPosArray[2];

    // get the first index of the arc/circle analysis, which should be sufficient because we've already proven the arrays are identical by this point
    let arcCircleAnalysis = FormItPlugins.GenerateStringLights.arrays.arcCircleAnalysisArray[0];
    //console.log("Arc/circle analysis to use as reference: " + JSON.stringify(arcCircleAnalysis));

    radius = arcCircleAnalysis["radius"];
    //console.log("Radius of circle: " + JSON.stringify(radius));

    let center = arcCircleAnalysis["center"];
    //console.log("Center of circle or arc: " + JSON.stringify(center));

    let xAxis = arcCircleAnalysis["xaxis"];
    //console.log("X axis of circle or arc: " + JSON.stringify(xAxis));

    let normal = arcCircleAnalysis["normal"];
    //console.log("Normal of circle or arc: " + JSON.stringify(normal));
    
    let pi = 3.1415926535897932384626433832795;
    circumference = radius * 2 * pi;
    //console.log("Circumference of circle or arc: " + JSON.stringify(circumference));

    // define how to get the total arc length by adding faceted edge lengths together
    function getFacetedArcLength(nObjectIDArray, point3DArray)
    {
        //console.log("\nCalculating faceted arc length by adding up all segments...");
        // for each edge on the arc or circle, measure the distance between the two points
        for(let p = 0; p < nObjectIDArray.length * 2; p++)
        {
            let x0 = point3DArray[p]["x"];
            let x1 = point3DArray[p + 1]["x"];
            //console.log("x0 = " + x0 + " and x1 = " + x1);

            let y0 = point3DArray[p]["y"];
            let y1 = point3DArray[p + 1]["y"];
            //console.log("y0 = " + y0 + " and y1 = " + y1);

            let z0 = point3DArray[p]["z"];
            let z1 = point3DArray[p + 1]["z"];
            //console.log("z0 = " + z0 + " and z1 = " + z1);

            // this function is stored in utils
            let distanceBetweenTwoPoints = getDistanceBetweenTwoPoints(x0,y0,z0,x1,y1,z1);

            FormItPlugins.GenerateStringLights.arrays.edgeLengthArray.push(distanceBetweenTwoPoints);
            //console.log("Edge length array: " + deanstein.GenerateStringLights.arrays.edgeLengthArray);

            // since each point3D is in a set of 2 (for each end of each line), increase the for variable again
            p = p + 1;
        }
        //console.log("Edge length array: " + deanstein.GenerateStringLights.arrays.edgeLengthArray);

        // debug to ensure all three points are getting the same distance from the center
        function getDistanceToCircleCenter(point0, center)
        {
            let x0 = point0["x"];
            let x1 = center["x"];

            let y0 = point0["y"];
            let y1 = center["y"];

            let z0 = point0["z"];
            let z1 = center["z"];

            return getDistanceBetweenTwoPoints(x0,y0,z0, x1,y1,z1);
        }

        //console.log("\nVerifying the calculated radius to compare against the radius reported from the attribute...\n");
        //console.log("Radius of circle or arc (from attribute): " + JSON.stringify(radius));
        //console.log("Distance from arcStartPos to center (calculated): " + getDistanceToCircleCenter(arcStartPos, center));
        //console.log("Distance from arcEndPos to center (calculated): " + getDistanceToCircleCenter(arcEndPos, center));
        //console.log("Distance from thirdPointPos to center (calculated): " + getDistanceToCircleCenter(thirdPointPos, center) + "\n");

        let facetedArcLength = 0;

        for (let q = 0; q < FormItPlugins.GenerateStringLights.arrays.edgeLengthArray.length; q++)
        {
            facetedArcLength = facetedArcLength + FormItPlugins.GenerateStringLights.arrays.edgeLengthArray[q];
        }
        //console.log("Number of edges used to calculate length: " + deanstein.GenerateStringLights.arrays.edgeLengthArray.length);
        //console.log("Existing arc length: " + facetedArcLength);
        return facetedArcLength;
    }

    let nObjectIDArray = FormItPlugins.GenerateStringLights.arrays.nObjectIDArray;
    let point3DArray = FormItPlugins.GenerateStringLights.arrays.point3DArray;

    facetedArcLength = getFacetedArcLength(nObjectIDArray, point3DArray);

    quarterCircleLength = circumference / 4;

    // determine how many quarter-circles this faceted arc represents
    quarterCircleMultiplier = facetedArcLength / quarterCircleLength;
    //console.log("Quarter circle multiplier: " + quarterCircleMultiplier);

    // Number of facets in each 90 degree arc segment; if circle, 4x this amount
    //let accuracyORcount = (quarterCircleMultiplier / 0.25) * (args.cableFacetCount);
    let accuracyORcount = (Math.floor(args.cableFacetCount / quarterCircleMultiplier));
    //console.log("accuracyORcount: " + accuracyORcount);
    //console.log("Effective accuracyORcount (x multiplier): " + (Math.ceil(quarterCircleMultiplier * accuracyORcount)));
    //console.log("Requested facet count: " + args.facetCount);
    if (Math.ceil(accuracyORcount * quarterCircleMultiplier) < args.facetCount)
    {
        //console.log("The requested facet count was higher than the resulting accuracyORcount value, so accuracyORcount was ignored.")
    }
    let bReadOnly = false;
    let trans;
    let nMinimumNumberOfFacets = args.cableFacetCount;

    // if delete is checked, delete the original edges
    let bDelete = true;
    for (let n = 0; n < FormItPlugins.GenerateStringLights.arrays.nObjectIDArray.length; n++)
    {
        if (bDelete === true) 
        {
            await WSM.APIDeleteObject(nHistoryID, FormItPlugins.GenerateStringLights.arrays.nObjectIDArray[n]);
        }
    }

    if (bDelete === true)
    {
        console.log("\nDeleted the old curve.");
    }

    // execute the rebuild
    await WSM.APICreateCircleOrArcFromPoints(nHistoryID, arcStartPos, arcEndPos, thirdPointPos, accuracyORcount, bReadOnly, trans, nMinimumNumberOfFacets, bCircle);
    
    // get the changed data and fill out the object ID array with the data
    let createdDataIDs = await FormItPlugins.GenerateStringLights.getIDsByCreatedChangedOrDeletedDataInHistory(nHistoryID, WSM.nObjectType.nEdgeType, "created");

    let newFacetCount = createdDataIDs.length;
    //console.log("New edge IDs: " + newEdgeIDs);
    console.log("\nCreated a new curve with " + newFacetCount + " faceted edges.");
}

// define how to place points evenly on an arc/circle
FormItPlugins.GenerateStringLights.generatePointsAlongArcCircle = async function(args)
{
    // assume the selected curve is the target curve, and that the getInfo() arrays represent that selection
    //console.log("\nBegin drawing evenly-spaced points along the arc/circle...");

    // get the three definition points
    await FormItPlugins.GenerateStringLights.getArcCircle3PointPosArray();

    let arcStartVertexID = FormItPlugins.GenerateStringLights.arrays.arcCircle3PointIDArray[0];
    let arcStartPos = FormItPlugins.GenerateStringLights.arrays.arcCircle3PointPosArray[0];
    let thirdPoint = FormItPlugins.GenerateStringLights.arrays.arcCircle3PointPosArray[1];
    let arcEndPos = FormItPlugins.GenerateStringLights.arrays.arcCircle3PointPosArray[2];

    let lightCount = args.fixtureCount;
    let facetCountForLights = lightCount + 1;

    // set parameters for temporary arc to get light points
    let accuracyORcount = (Math.floor(facetCountForLights / quarterCircleMultiplier));
    // if true, no arc will be drawn, but the points will be returned
    let bReadOnly = true;
    let trans;
    let nMinimumNumberOfFacets = facetCountForLights;
    bCircle = false;

    // create a temporary arc
    let temporaryArcPointPosArray = await WSM.APICreateCircleOrArcFromPoints(nHistoryID, arcStartPos, arcEndPos, thirdPoint, accuracyORcount, bReadOnly, trans, nMinimumNumberOfFacets, bCircle);
    //console.log("Created a new temporary arc based on the input line.");
    //console.log("Points from temporary arc: " + JSON.stringify(temporaryArcPointPosArray));

    // remove the first and last points from the temporary arc points to create the points at which new lights will hang
    //console.log("Number of points in temporary arc point array: " + temporaryArcPointPosArray.length);
    temporaryArcPointPosArray.splice((temporaryArcPointPosArray.length - 1), 1);
    temporaryArcPointPosArray.splice(0, 1);

    let lightMountPointPosArray = temporaryArcPointPosArray;
    //console.log("Points for mounting lights: " + JSON.stringify(temporaryArcPointPosArray));

    // if no arcBulge was set to 0, we need to use the Z-value from an end point, and replace the Z-values of all other points
    // this will create string lights along a straight line, not an arc
    if (operationType === "lineNoBulge")
    {
        // this is the Z-height we want to apply to all other points
        let correctedZHeight = arcStartPos.z;
        //console.log("Z-height: " + zHeight);

        // for each point, replace the current Z-value with the corrected Z-height
        for (let i = 0; i < lightMountPointPosArray.length; i++)
        {
            lightMountPointPosArray[i].z = correctedZHeight;
        }
    }

    return lightMountPointPosArray;
}

// define how to draw a single light fixture; returns the group ID the fixture exists in
FormItPlugins.GenerateStringLights.drawSingleLightFixture = async function(placementPoint, args)
{
    //console.log("\nDrawing the typical light fixture...");

    // take the placement point and move it down to represent a cable or bulb housing length
    let verticalCableOrHousingLength = args.verticalCableOrHousingLength;
    let verticalCableBottomPointPos = await WSM.Geom.Point3d(placementPoint["x"], placementPoint["y"], placementPoint["z"] - verticalCableOrHousingLength);

    //console.log("Bottom point of vertical cable " + JSON.stringify(verticalCableBottomPointPos));

    // create an empty group
    let typicalLightFixtureGroupID = await WSM.APICreateGroup(nHistoryID, []);
    //console.log("Created a new group for a typical fixture: " + typicalLightFixtureGroupID);

    // create a new history to create the light fixture
    let typicalLightFixtureHistoryID =  await WSM.APIGetGroupReferencedHistoryReadOnly(nHistoryID, typicalLightFixtureGroupID);
    //console.log("Created a new history for the typical light fixture: " + typicalLightFixtureHistoryID);

    // draw a single vertical line connecting the two points
    await WSM.APIConnectPoint3ds(typicalLightFixtureHistoryID, placementPoint, verticalCableBottomPointPos);
    //console.log("Drew a single line representing the cable length or bulb housing.");

    // find the edge that was just created so it can be highlighted and checked
    let changedData = await WSM.APIGetAllObjectsByTypeReadOnly(typicalLightFixtureHistoryID, WSM.nObjectType.nEdgeType);
    //console.log("Changed data: " + JSON.stringify(changedData));
    let cablePathID = changedData[0];
    //console.log("Sweep path ID: " + JSON.stringify(cablePathID));

    let bulbCount = args.bulbsPerFixture;
    let verticalCableOrHousingRadius = args.verticalCableOrHousingRadius;

    // create bulbs
    async function createBulbs(args)
    {
        let bulbRadius = args.bulbRadius;
        //console.log("Bulb radius: " + bulbRadius);
        let bulbCount = args.bulbsPerFixture;

        // set the bulb center point below the end of the cable
        let bulbCenterPointPos = await WSM.Geom.Point3d(verticalCableBottomPointPos["x"], verticalCableBottomPointPos["y"], verticalCableBottomPointPos["z"] - bulbRadius);
        //console.log("Bulb center point: " + JSON.stringify(bulbCenterPointPos));

        // draw the bulb
        //console.log("Drawing typical bulb...");

        // create a group for typical bulb
        let typicalBulbGroupID = await WSM.APICreateGroup(typicalLightFixtureHistoryID, []);
        //console.log("Created a new group for a typical bulb: " + typicalBulbGroupID);

        let typicalBulbInstanceIDArray = await WSM.APIGetObjectsByTypeReadOnly(typicalLightFixtureHistoryID, typicalBulbGroupID, WSM.nObjectType.nInstanceType);

        // create a new history for the bulb
        let typicalBulbHistoryID = await WSM.APIGetGroupReferencedHistoryReadOnly(typicalLightFixtureHistoryID, typicalBulbGroupID);
        //console.log("Created a new history for the typical light fixture: " + typicalBulbHistoryID);

        let bulbAccuracyORcount = 4;
        let bulbTopHalf = await WSM.APICreateHemisphere(typicalBulbHistoryID, bulbRadius, bulbCenterPointPos, bulbAccuracyORcount);
        let bulbBottomHalf = await WSM.APICopyOrSketchAndTransformObjects(typicalBulbHistoryID, typicalBulbHistoryID, bulbTopHalf, await WSM.Geom.MakeRigidTransform(await WSM.Geom.Point3d(0, 0, 2 * bulbCenterPointPos["z"]), await WSM.Geom.Vector3d(1, 0, 0), await WSM.Geom.Vector3d(0, 1, 0), await WSM.Geom.Vector3d(0, 0, -1)), 1, false);

        // join the top and bottom halves
        await WSM.APIUnite(typicalBulbHistoryID, bulbTopHalf, bulbBottomHalf[0]);

        // copy bulbs, if requested
        if (bulbCount > 1)
        {
            console.log("Multiple bulbs requested.");
            await WSM.APICopyOrSketchAndTransformObjects(typicalLightFixtureHistoryID, typicalLightFixtureHistoryID, typicalBulbInstanceIDArray[0], await WSM.Geom.MakeRigidTransform(await WSM.Geom.Point3d(0, 0, -(bulbRadius * 2)), await WSM.Geom.Vector3d(1, 0, 0), await WSM.Geom.Vector3d(0, 1, 0), await WSM.Geom.Vector3d(0, 0, 1)), bulbCount - 1, false);

            // get all the group IDs from the array of bulbs
            let bulbGroupIDArray = await WSM.APIGetObjectsByTypeReadOnly(typicalLightFixtureHistoryID, typicalBulbInstanceIDArray[0], WSM.nGroupType, true);

            // create a group to contain multiple bulbs
            await WSM.APICreateGroup(typicalLightFixtureHistoryID, bulbGroupIDArray);
            //console.log("Created a new group for multiple bulbs " + bulbContainerGroupID);
        }
    }

    // only create bulbs if they're requested
    if (bulbCount != 0)
    {
        createBulbs(args);
    }
    else if (bulbCount === 0)
    {
        console.log("No bulbs were requested.");
    }

    // sweep the initial line into a cable or housing
    //console.log("Begin sweep of vertical cable...");

    // first, create the profile face
    await WSM.APICreateCircleOrArc(typicalLightFixtureHistoryID, verticalCableOrHousingRadius, placementPoint);
    //console.log("Fixture history ID: " + typicalLightFixtureHistoryID);

    // find the face that was just created
    let allObjectsByType = await WSM.APIGetAllObjectsByTypeReadOnly(typicalLightFixtureHistoryID, WSM.nObjectType.nFaceType);
    let newProfileID = allObjectsByType[0];
    //console.log("Sweep face ID: " + newProfileID);
    //console.log("New profile face ID: " + JSON.stringify(newProfileFaceID));
    //console.log("Typical light fixture history ID: " + typicalLightFixtureHistoryID);

    let aProfile = [{"ids":[{"History":typicalLightFixtureHistoryID,"Object":newProfileID,"objectName":"ObjectHistoryID"}], "objectName": "GroupInstancePath"}];
    
    let aPath = [{"ids":[{"History":typicalLightFixtureHistoryID,"Object":cablePathID,"objectName":"ObjectHistoryID"}], "objectName": "GroupInstancePath"}];
    let bRemoveUnusedProfileAndPath = true;

    // execute the sweep
    await WSM.APISweep(typicalLightFixtureHistoryID, aProfile, aPath, bRemoveUnusedProfileAndPath);

    let typicalFixtureInstanceIDArray = await WSM.APIGetObjectsByTypeReadOnly(nHistoryID, typicalLightFixtureGroupID, WSM.nObjectType.nInstanceType);

    //console.log("Done making the typical fixture inside instance ID " + JSON.stringify(typicalFixtureInstanceIDArray[0]));
    return typicalFixtureInstanceIDArray[0];
}
    

// define how to array the light fixtures at each point
FormItPlugins.GenerateStringLights.arrayStringLights = async function(typicalFixtureInstanceID, placementPointArray)
{
    //console.log("\nArraying string light fixtures...");

    let transformArray = [];

    for (let g = 0; g < placementPointArray.length - 1; g++)
    {
        let point0 = placementPointArray[0];
        let point1 = placementPointArray[g + 1];

        let x0 = point0["x"];
        let y0 = point0["y"];
        let z0 = point0["z"];

        let x1 = point1["x"];
        let y1 = point1["y"];
        let z1 = point1["z"];

        // this is stored in utils
        let arrayLightFixtureVector = getVectorBetweenTwoPoints(x0,y0,z0, x1,y1,z1);
        //console.log("Array light fixture vector: " + arrayLightFixtureVector);

        let transform = await WSM.Geom.MakeRigidTransform(await WSM.Geom.Point3d(arrayLightFixtureVector[0], arrayLightFixtureVector[1], arrayLightFixtureVector[2]), await WSM.Geom.Vector3d(1, 0, 0), await WSM.Geom.Vector3d(0, 1, 0), await WSM.Geom.Vector3d(0, 0, 1));
        //console.log("Transform: " + JSON.stringify(transform));

        await WSM.APICopyOrSketchAndTransformObjects(nHistoryID, nHistoryID, typicalFixtureInstanceID, transform, 1, false);
    }

    //console.log("Arrayed instance ID " + typicalFixtureInstanceID + " " + placementPointArray.length + " times.");
}

// execute all code required to generate string lights
FormItPlugins.GenerateStringLights.execute = async function()
{
    console.clear();
    console.log("String Light Generator Plugin\n");

    // package up the inputs from the HTML page into a single object
    let args = 
    {
        "fixtureCount": Number(document.getElementById(fixtureCountInputID).value),
        "bulbsPerFixture": Number(document.getElementById(bulbsPerFixtureInputID).value),
        "bulbRadius": (await FormIt.StringConversion.StringToLinearValue(document.getElementById(bulbRadiusInputID).value)).second,
        "verticalCableOrHousingLength": (await FormIt.StringConversion.StringToLinearValue(document.getElementById(cableOrHousingHeightInputID).value)).second,
        "verticalCableOrHousingRadius": (await FormIt.StringConversion.StringToLinearValue(document.getElementById(cableOrHousingRadiusInputID).value)).second,
        "cableFacetCount" : Number(document.getElementById(catenaryCableFacetCountInputID).value),
        "cableRadius": (await FormIt.StringConversion.StringToLinearValue(document.getElementById(catenaryCableRadiusInputID).value)).second,
        "arcBulge": (await FormIt.StringConversion.StringToLinearValue(document.getElementById(catenaryCableBulgeInputID).value)).second
    }

    // by default, rebuild the arc so it's smoother
    let bRebuildArc = true;

    // assume the previous operation was successful - this flag will change if this operation fails
    success = true;

    // execute the get selection basics routine
    let isSomethingSelected = await FormItPlugins.GenerateStringLights.getSelectionBasics();

    // if nothing is selected, skip the rest of the steps
    // a message indicating nothing was selected is already handled in the getSelectionBasics function
    if (!isSomethingSelected)
    {
        return;
    }

    // get the object IDs of the selected geometry
    let selectedObjectIDs = await FormItPlugins.GenerateStringLights.getObjectIDsBySelection(currentSelection);

    // execute the get selection info routine
    await FormItPlugins.GenerateStringLights.getInfoByIDs(nHistoryID, selectedObjectIDs);

    // set a flag based on whether we precheck
    let preCheckPassed = await FormItPlugins.GenerateStringLights.preCheck(args);

    // if we prechecked, then define the operation type; otherwise, stop
    if (preCheckPassed === true)
    {
        operationType = await FormItPlugins.GenerateStringLights.getOperationType(args);
    }
    else
    {
        return;
    }
    
    await FormIt.UndoManagement.BeginState();

    let vertexIDArrayForRebuild;

    // if the operation type is a line, we first need to make an arc from scratch
    if (operationType === "line") 
    {
        // create the new catenary arc, then define the target curve as this new curve
        vertexIDArrayForRebuild = await FormItPlugins.GenerateStringLights.createCatenaryArcFromLine(nHistoryID, args);
    }

    // if 0 arc bulge is specified, we have to do a few things differently
    else if (operationType === "lineNoBulge")
    {
        // temporarily set the arc bulge to a non-0 to create a temporary arc to place points correctly
        args.arcBulge = 1;

        // later, the Z-values will be reset to keep this at no bulge
        vertexIDArrayForRebuild = await FormItPlugins.GenerateStringLights.createCatenaryArcFromLine(nHistoryID, args);
    }

    // if creating the new arc was unsuccessful, we need to return before the undo management starts
    if (success === false)
    {
        // indicate the operation was unsuccessful
        let message = "Something went wrong creating string lights. \nIf the selected path was vertical, try selecting a path that is partially horizontal.";
        await FormIt.UI.ShowNotification(message, FormIt.NotificationType.Error, 0);
        console.log("\n" + message);
        
        await FormIt.UndoManagement.EndState("Generate String Lights");
        return;
    }

    // otherwise, use the selected curve to generate lights along
    else if (operationType === "arcCircle")
    {
        // define the target curve as the selected curve
        vertexIDArrayForRebuild = FormItPlugins.GenerateStringLights.arrays.nVertexIDArray;
        //console.log("Vertex ID array for curve to be rebuilt: " + JSON.stringify(vertexIDArrayForRebuild));
    }

    if (bRebuildArc) 
    {
        await FormItPlugins.GenerateStringLights.rebuildArcCircle(vertexIDArrayForRebuild, args);

        // get the changed data and fill out the object ID array with the data  
        let createdDataIDs = await FormItPlugins.GenerateStringLights.getIDsByCreatedChangedOrDeletedDataInHistory(nHistoryID, WSM.nObjectType.nEdgeType, "created");

        // re-run the get info routine to populate the arrays with the new curve information
        await FormItPlugins.GenerateStringLights.getInfoByIDs(nHistoryID, createdDataIDs);
        //console.log("\nPopulating arrays with new selection info: " + createdDataIDs);
    }

    // execute drawing new points along the arc or circle; returns an array of points for use in generating new lights
    let placementPointArray = await FormItPlugins.GenerateStringLights.generatePointsAlongArcCircle(args);
    let placementPoint = placementPointArray[0];

    // execute drawing a single typical fixture
    let typicalFixtureInstanceID = await FormItPlugins.GenerateStringLights.drawSingleLightFixture(placementPoint, args);

    // execute arraying the typical fixture
    await FormItPlugins.GenerateStringLights.arrayStringLights(typicalFixtureInstanceID, placementPointArray);

    // get all the group IDs from the array of fixtures
    let fixtureGroupIDArray = await WSM.APIGetObjectsByTypeReadOnly(nHistoryID, typicalFixtureInstanceID, WSM.nObjectType.nGroupType, true);

    // use the first Group ID to get the typical ID for all Groups
    let fixtureGroupID = fixtureGroupIDArray[0];

    // define the group ID that will contain all pieces of the new string light assembly
    let stringLightContainerGroupID = await WSM.APICreateGroup(nHistoryID, fixtureGroupID);
    // make a new history for the light fixture group
    let stringLightContainerHistoryID = await WSM.APIGetGroupReferencedHistoryReadOnly(nHistoryID, stringLightContainerGroupID);
    // get the instance ID
    let stringLightContainerInstanceID = await WSM.APIGetObjectsByTypeReadOnly(nHistoryID, stringLightContainerGroupID, WSM.nObjectType.nInstanceType);
    //console.log("stringLightContainerInstanceID: " + stringLightContainerInstanceID);

    // define the group ID that will contain all final pieces
    let finalContainerGroupID = await WSM.APICreateGroup(nHistoryID, stringLightContainerGroupID);
    // make a new history for the final pieces
    let finalContainerHistoryID = await WSM.APIGetGroupReferencedHistoryReadOnly(nHistoryID, finalContainerGroupID);
    // get the instance ID
    // WSM.nInstanceType = 24
    let finalContainerInstanceID = await WSM.APIGetObjectsByTypeReadOnly(nHistoryID, finalContainerGroupID, WSM.nObjectType.nInstanceType);
    //console.log("finalContainerInstanceID: " + JSON.stringify(finalContainerInstanceID));

    // move the path curve into the final container group
    await WSM.APICopyOrSketchAndTransformObjects(nHistoryID, finalContainerHistoryID, FormItPlugins.GenerateStringLights.arrays.nObjectIDArray, await WSM.Geom.MakeRigidTransform(await WSM.Geom.Point3d(0, 0, 0), await WSM.Geom.Vector3d(1, 0, 0), await WSM.Geom.Vector3d(0, 1, 0), await WSM.Geom.Vector3d(0, 0, 1)), 1, false);

    // delete the old curve
    for (let i = 0; i < FormItPlugins.GenerateStringLights.arrays.nObjectIDArray.length; i++)
    {
        await WSM.APIDeleteObject(nHistoryID, FormItPlugins.GenerateStringLights.arrays.nObjectIDArray[i]);
    }

    // find the curve that was just created
    let newPathIDArray = await WSM.APIGetAllObjectsByTypeReadOnly(finalContainerHistoryID, WSM.nObjectType.nEdgeType);

    let aPath;

    // if lineNoBulge, use the path the user selected initially (should be a line)
    if (operationType === "lineNoBulge")
    {
        // move the selected curve (should be a line) into the final container group
        await WSM.APICopyOrSketchAndTransformObjects(nHistoryID, finalContainerHistoryID, selectedObjectIDs, await WSM.Geom.MakeRigidTransform(await WSM.Geom.Point3d(0, 0, 0), await WSM.Geom.Vector3d(1, 0, 0), await WSM.Geom.Vector3d(0, 1, 0), await WSM.Geom.Vector3d(0, 0, 1)), 1, false);

        // find the IDs of the geoemetry just copied into this history
        let selectedPathIDArray = await FormItPlugins.GenerateStringLights.getIDsByCreatedChangedOrDeletedDataInHistory(finalContainerHistoryID, WSM.nObjectType.nEdgeType, "created");

        // get the objectHistoryIDArray for the edge IDs that make up the sweep path
        aPath = await WSM.Utils.ObjectHistoryIDArray(selectedPathIDArray);

        // delete the original arc path
        for (let i = 0; i < newPathIDArray.length; i++)
        {
            await WSM.APIDeleteObject(finalContainerHistoryID, newPathIDArray[i]);
        }
    }
    // otherwise, use the IDs of the new curve that was just created
    else
    {
        // get the group instance paths for the edge IDs that make up the sweep path
        aPath = await WSM.Utils.GroupInstancePathArray(newPathIDArray, finalContainerHistoryID);
    }

    // for each of the objects in aPath, correct the HistoryID to reflect the finalContainerHistoryID
    // TODO: consume the updated WSM.Utils.ObjectHistoryIDArray which will take a History argument, so we don't have to do this anymore
    function correctHistoryIDsInObjectHistoryIDArray()
    {
        for (let i = 0; i < aPath.length; i++ )
        {
            aPath[i]["History"] = finalContainerHistoryID;
            //correctedPath.push
        }
    }

    correctHistoryIDsInObjectHistoryIDArray();
    //console.log("Path: " + JSON.stringify(aPath));

    // sweep the catenary cable
    //console.log("Begin sweep of catenary cable...");

    // get the radius from the HTML page
    let catenaryCableRadius = args.cableRadius;
    // get the end point of the arc
    let catenaryCableProfileCenterPos = FormItPlugins.GenerateStringLights.arrays.arcCircle3PointPosArray[0];
    //console.log("Center point for catenary profile: " + JSON.stringify(catenaryCableProfileCenterPos));

    // use the vector created by the two end points of the selected line or arc as the profile surface normal
    let arcStartPos = FormItPlugins.GenerateStringLights.arrays.arcCircle3PointPosArray[0];
    let arcEndPos = FormItPlugins.GenerateStringLights.arrays.arcCircle3PointPosArray[2];
    let zAxisVector = getVectorBetweenTwoPoints(arcStartPos["x"], arcStartPos["y"], arcStartPos["z"], arcEndPos["x"], arcEndPos["y"], arcEndPos["z"]);
    let zAxisWSMVector3d = await WSM.Geom.Vector3d(zAxisVector[0], zAxisVector[1], zAxisVector[2]);
    //console.log(JSON.stringify("Profile surface Z-axis vector: " + JSON.stringify(zAxisWSMVector3d)));

    // set an arbitrary x-axis for the circle to start
    let xAxisVector = [1, 0, 0];
    // check if xAxis is in the same direction as zAxis, and if so, change the arbitrary xAxis vector
    if (1 - Math.abs(dotProductVector(zAxisVector, xAxisVector)) < 1.0e-10)
    {
        //console.log("Switching xAxis...");
        xAxisVector = [0, 1, 0];
    }
    let xAxisWSMVector3d = await WSM.Geom.Vector3d(xAxisVector[0], xAxisVector[1], xAxisVector[2]);
    //console.log(JSON.stringify("Profile surface arbitrary X-axis vector: " + JSON.stringify(xAxisWSMVector3d)));

    // determine the y-axis vector for the circle, using cross-product of X and Z
    // this function is stored in utils
    let yAxisVector = crossProductVector(zAxisVector, xAxisVector);
    let yAxisWSMVector3d = await WSM.Geom.Vector3d(yAxisVector[0], yAxisVector[1], yAxisVector[2]);
    //console.log(JSON.stringify("Profile surface Y-axis vector: " + JSON.stringify(yAxisWSMVector3d)));

    // recalculate the actual x-axis vector for the circle, using cross-product of Y and Z
    // this function is stored in utils
    xAxisVector = crossProductVector(yAxisVector, zAxisVector);
    xAxisWSMVector3d = await WSM.Geom.Vector3d(xAxisVector[0], xAxisVector[1], xAxisVector[2]);
    //console.log(JSON.stringify("Profile surface X-axis vector: " + JSON.stringify(xAxisWSMVector3d)));

    // create the profile at one of the end points of the catenary curve
    await WSM.APICreateCircleOrArc(finalContainerHistoryID, catenaryCableRadius, catenaryCableProfileCenterPos, xAxisWSMVector3d, yAxisWSMVector3d);

    // find the face that was just created
    let allObjectsByType = await WSM.APIGetAllObjectsByTypeReadOnly(finalContainerHistoryID, WSM.nObjectType.nFaceType);
    //console.log("Changed data: " + JSON.stringify(changedData));
    let newProfileFaceID = allObjectsByType[0];
    //console.log("New profile face ID: " + JSON.stringify(newProfileFaceID));

    // manually create the WSM path to the profile face
    let aProfile = [{"ids":[{"History":finalContainerHistoryID,"Object":newProfileFaceID,"objectName":"ObjectHistoryID"}], "objectName": "GroupInstancePath"}];
    //console.log("Profile: " + JSON.stringify(aProfile));

    let bRemoveUnusedProfileAndPath = true;

    // execute the catenary cable sweep
    await WSM.APISweep(finalContainerHistoryID, aProfile, aPath, bRemoveUnusedProfileAndPath);

    await FormIt.UndoManagement.EndState("Generate String Lights");

    // indicate the operation has finished
    let message = "Generated string lights along the selected path.";
    await FormIt.UI.ShowNotification(message, FormIt.NotificationType.Success, 0);
    console.log("\n" + message);

}