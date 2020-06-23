    var creatureID = 0;
    var currentID = "";
    //var statusID = 0;
    var totalCreatures = 0;
        
    var currentTurn = 0;
    var currentRound = 0;

    const DOTMOVE = 25;
    var dotPos = 0;

    var statusList = {};

    function Status(name, description, length, id){
        this.name = name;
        this.description = description;
        this.length = length;
        this.id = id;
        this.statusid = 0;
        
        if (statusList[id] == null){
            statusList[id] = [];
        }
        else{
            for (let i = 0; i < statusList[id].length; i++){
                this.statusid++;
            }
        }
        
        let item = $("#statusul").append(`<li class="statusList" id="status${id}${this.statusid}">` + name + ", " + length + " rounds left" + "</li>");
        let button = item.append(`<button class="statusList" id="button${id}${this.statusid}">` + "Remove" + "</button>");
            
        $(`button#button${id}${this.statusid}`).one("click", [`#status${id}${this.statusid}`, `#button${id}${this.statusid}`, id, this.statusid], RemoveStatus);
    }

    function RemoveStatus(e) {
        console.log(e.data[0]);
        $(e.data[0]).remove();
        $(e.data[1]).remove();
        statusList[e.data[2]].splice(e.data[3], 1);
    }

    function OpenStatuses () {
        if (statusList[currentID] != null)
        {
            for (let i = 0; i < statusList[currentID].length; i++){
                console.log("item: " + i + ", " + statusList[currentID][i].name);
                console.log("item: " + i + ", " + statusList[currentID][i].statusid);
                let item = $("#statusul").append(`<li class="statusList" id="status${currentID}${i}">` + statusList[currentID][i].name + ", " + statusList[currentID][i].length + " rounds left" + "</li>");
                let button = item.append(`<button class="statusList" id="button${currentID}${i}">` + "Remove" + "</button>");
                $(`button#button${currentID}${i}`).one("click", function () {
                    $(`li#status${currentID}${i}`).remove();
                    $(`button#button${currentID}${i}`).remove();
                    statusList[currentID].splice(i, 1);
                });
            }
        }
    }
        
    $(function() {
             
        //Add events
        $("input#chealth").change(function () {
            //$("#"+$(this).attr('target')).attr("health", $(this).val());
            $("#"+currentID).attr("health", $(this).val());
        });
        
        $("#reset").click( function () {
            $("li").remove();
            $(".modal-content").css("display", "none");
            
            $(".dot").animate({
                top: `-=${DOTMOVE*(currentTurn)}`
            }, 0, function () {
                
                $(this).css("display", "none");
                dotPos = 0;
                $("#currentRound").text(0);
            });
            
            currentRound = 0;
            currentTurn = 0;
            totalCreatures = 0;
            statusList = {};
        });
        
        $("#add").click(function () {
            $("#fname").val("");
            $("#fini").val("");
            $("#addModal").css("display", "block");
        });
        
        $(".close").click(function () {
            $(".modal-content").css("display", "none");
        });
        
        $("#close").click(function () {
            $(".modal-content").css("display", "none");
        });
        
        $("#done").click(function () {
            
            if (totalCreatures == 0){
                $(".dot").css("display", "inline-block");
            }
            
            let name = $("#fname").val();
            let init = parseInt($("#fini").val());
            var size = 0;
            var smallest = true;
            
            var bestIndex = 0;
            var bestIni = -Infinity;
        
            $("li").each( function (index, value) {
                size++;
                
                let str = $(value).text();
                var iniIndex = str.indexOf(" Initiative:");
                var tempIni = "";
            
                for (var i = 0; i < iniIndex; i++) {
                    tempIni += str.charAt(i);
                }             
                tempIni = parseInt(tempIni);
                
                if (init > tempIni && tempIni > bestIni){
                    bestIndex = index;
                    bestIni = tempIni;
                    smallest = false;
                }
            });
        
            
            var item;
            
            if (size > 0 && !smallest){
                item = $("li:eq("+bestIndex+")").before(`<li health='0' id='creature${creatureID}'  class='creature-list-item'>` + init + " Initiative: " + name + "</li>");
            }
            else{
                item = $(".creature-list").append(`<li health='0' id='creature${creatureID}' class='creature-list-item'>` + init + " Initiative: " + name + "</li>");
            }
            
            var newID = creatureID;
            
            $(`#creature${newID}`).click(function () {
                //$("input#chealth").attr("target", `creature${newID}`);
                currentID = `creature${newID}`;
                $("input#chealth").val($(`#creature${newID}`).attr("health"));
                $("#healthModal").css("display", "block");
                
                $(".statusList").remove();
                OpenStatuses();
            });
            
            totalCreatures++;
            creatureID++;
        });
        
        $("#delete").click(function () {
            let item = $("#"+currentID);
            let listIndex = $("li").index(item);
            $(item).remove();
            $("#healthModal").css("display", "none");
            totalCreatures--;
            
            if (listIndex < dotPos || dotPos == totalCreatures && dotPos != 0){
                $(".dot").animate({
                    top: `-=${DOTMOVE}`
                }, 0, function () {
                    dotPos--;
                });
            }
            
            if (totalCreatures == 0){
                $(".dot").css("display", "none");
            }
        });
        
        $("#turn").click( function () {
        
            if (totalCreatures > 0){
                currentTurn++;
                
                $(".modal-content").css("display", "none");
                
                if (dotPos < totalCreatures-1) {
                    $(".dot").animate({
                        top: `+=${DOTMOVE}`
                    }, 100, function ()  {
                        dotPos++;
                    });
                }
                else {
                    currentTurn = 0;
                    currentRound++;
                    
                    for (const [key, value] of Object.entries(statusList)){
                        let removeList = [];
                        let value = statusList[key];
                        for (let i = 0; i < value.length; i++){
                            value[i].length--;
                            
                            if (value[i].length < 0){
                                removeList.push(i);       
                            }
                        }
                        
                        for (let i = 0; i < removeList.length; i++){
                            value.splice(removeList[i], 1);
                        }
                    }
                    
                    $(".dot").animate({
                        top: `-=${DOTMOVE*(totalCreatures-1)}`
                    }, 100, function () {
                        dotPos = 0;
                        $("#currentRound").text(currentRound);
                    });
                }
            }
        });
        
        $("button#add-status").click( function () {
            $("#statusModal").css("display", "block");
        });
        
        $("button#scancel").click( function () {
            $("#statusModal").css("display", "none");
        });
        
        $("#sadd").click( function () {       
            let name = $("#sname").val();
            let length = $("#sleng").val();
            var id = currentID;
            
            let status = new Status(name, "", length, id);
            
            let arr = statusList[id];
            arr.push(status);
            statusList[id] = arr;
        });
    });