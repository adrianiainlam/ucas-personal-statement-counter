$ = document.getElementById.bind(document);
function printStats(lines, numLines, numChars, parasWithExtraSpace, parasLines) {
    $("results").innerHTML="";
    for(var i=0; i<numLines; i++) {
        $("results").innerHTML+=(i<9?"0"+(i+1):(i+1))+" "+lines[i]+"<br />";
        if(parasLines.indexOf(i+1)>=0 && $("chk2").checked) $("results").innerHTML+="<br />";
    }
    
    $("statLines").innerHTML="Lines: "+numLines+"/47";
    $("statLines").style.color=numLines>47?"red":"initial";
    $("statChars").innerHTML="Characters: "+numChars+"/4000";
    $("statChars").style.color=numChars>4000?"red":"initial";

    if(parasWithExtraSpace.length>0) {
        $("statWarn").innerHTML="Warning: Extra space(s) found at end of paragraph(s) "+parasWithExtraSpace.join(", ");
        $("statWarn").style.visibility="visible";
        $("statWarn").style.color="red";
    } else {
        $("statWarn").innerHTML="Warning: Extra space(s) found at end of paragraph(s) ";
        $("statWarn").style.visibility="hidden";
    }
}

function analyse() {
    var text=$("txt1").value;
    var parasWithExtraSpace=[];
    var parasLines=[];
    var paras=text.split('\n');
    var lines=[];
    var line=""
    if(text=="") {
        printStats(lines, 0, 0, parasWithExtraSpace, parasLines);
        return;
    }
    
    var maxlinelen = 94;
    if($("teacher").checked) maxlinelen = 80;
    
    for(var i=0; i<paras.length; i++) {
        if(paras[i][paras[i].length-1]==' ') parasWithExtraSpace.push(i+1);
        do {
            if(paras[i][0]==' ') {
                paras[i] = paras[i].substring(1); //remove preceding space
            }

            /* extract line of maxlinelen chars or fewer */
            if(paras[i].length > maxlinelen) {
                line = paras[i].substring(0, maxlinelen);
            } else {
                line = paras[i].substring(0, paras[i].length);
            }
            
            var lastidx = line.lastIndexOf(' ');
            if(lastidx >= 0) { //if there is a space in line
                if(line.length < maxlinelen) {
                    lastidx = line.length; //if it can contain whole line
                }
            } else {
                lastidx = line.length; //cutoff line if line has maxlinelen
            }                          // chars without spaces
            
            if(paras[i][maxlinelen] == ' ') { //if extracted right before a space
                lastidx = maxlinelen;
            }
            paras[i] = line.substring(lastidx+1)+paras[i].substring(maxlinelen); //remove extracted string (up to lastidx) from paras
            line=line.substring(0, lastidx);
            lines.push(line);
        } while(paras[i]!="");
        parasLines.push(lines.length); //lines where paragraphs end
    }
    printStats(lines, lines.length, text.length+paras.length-1, parasWithExtraSpace, parasLines);
}

function autocheck() {
    if($("chk1").checked) {
        $("txt1").addEventListener("input", analyse);
        $("btn1").style.visibility='hidden';
        analyse();
    } else {
        $("txt1").removeEventListener("input", analyse);
        $("btn1").style.visibility='visible';
    }
}
