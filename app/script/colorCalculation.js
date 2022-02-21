const MineCraftColors = [{name : 'White Wool', color : 'rgb(249, 255, 255)'},{name : 'Light Gray Wool', color : 'rgb(156, 157, 151)'},
{name : 'Gray Wool', color : 'rgb(71, 79, 82)'},
{name : 'Black Wool', color : 'rgb(29, 28, 33)'},{name : 'Yellow Wool', color : 'rgb(255, 216, 61)'},
{name : 'Orange Wool', color : 'rgb(249, 128, 29)'},{name : 'Red Wool', color : 'rgb(176, 46, 38)'},
{name : 'Brown Wool', color : 'rgb(130, 84, 50)'},{name : 'Lime Wool', color : 'rgb(128, 199, 31)'},
{name : 'Green Wool', color : 'rgb(93, 124, 21)'},{name : 'Light Blue Wool', color : 'rgb(58, 179, 218)'}
,{name : 'Cyan Wool', color : 'rgb(22, 156, 157)'},{name : 'Blue Wool', color : 'rgb(60, 68, 169)'}
,{name : 'Pink Wool', color : 'rgb(243, 140, 170)'},{name : 'Magenta Wool', color : 'rgb(198, 79, 189)'},
{name : 'Purple Wool', color : 'rgb(137, 50, 183)'}]


const AdvancedColors = [
{name : 'Stone', color : 'rgb(114, 114, 114)'},
{name : 'Granite', color : 'rgb(109, 76, 64)'},
{name : 'Polished Granite', color : 'rgb(148, 98, 82)'},
{name : 'Diorite', color : 'rgb(159, 159, 161)'},
{name : 'Polished Diorite', color : 'rgb(220, 220, 222)'},{name : 'Andesite', color : 'rgb(98, 98, 104)'},
{name : 'Polished Andesite', color : 'rgb(130, 131, 128)'},{name : 'Grass Block', color : 'rgb(87, 113, 53)'}
,{name : 'Coarse Dirt', color : 'rgb(120, 84, 57)'},{name : 'Podzol', color : 'rgb(70, 43, 27)'}
,{name : 'Cobblestone', color : 'rgb(165, 165, 165)'},{name : 'Oak Planks', color : 'rgb(185, 150, 96)'}
,{name : 'Spruce Planks', color : 'rgb(118, 86, 53)'},{name : 'Birch Planks', color : 'rgb(211, 199, 138)'}
,{name : 'Jungle Planks', color : 'rgb(180, 132, 98)'},{name : 'Acacia Planks', color : 'rgb(182, 102, 58)'}
,{name : 'Dark Oak Planks', color : 'rgb(72, 46, 23)'},{name : '', color : 'rgb()'}
,{name : 'Bedrock', color : 'rgb(50, 50, 50)'},{name : 'Sand', color : 'rgb(207, 202, 146)'}
,{name : 'Red Sand', color : 'rgb(159, 82, 28)'},{name : 'Gravel', color : 'rgb(138, 135, 134)'}
,{name : 'Iron Ore', color : 'rgb(125, 125, 125)'},{name : 'Oak Log', color : 'rgb(184, 149, 96)'}
,{name : 'Spruce Log', color : 'rgb(119, 89, 54)'},{name : 'Birch Log', color : 'rgb(195, 171, 113)'}
,{name : 'Jungle Log', color : 'rgb(186, 140, 97)'},{name : 'Acacia Log', color : 'rgb(176, 90, 58)'}
,{name : 'Dark Oak Log', color : 'rgb(90, 71, 47)'},{name : 'Stripped Oak Log', color : 'rgb(186, 150, 97)'}
,{name : 'Stripped Spruce Log', color : 'rgb(128, 95, 55)'},{name : 'Stripped Birch Log', color : 'rgb(196, 173, 116)'}
,{name : 'Stripped Jungle Log', color : 'rgb(176, 131, 88)'},{name : 'Stripped Acacia Log', color : 'rgb(182, 91, 58)'}
,{name : 'Stripped Dark Oak Log', color : 'rgb(90, 71, 47)'},{name : 'Stripped Oak Wood', color : 'rgb(192, 159, 101)'}
,{name : 'Stripped Spruce Wood', color : 'rgb(120, 90, 54)'},{name : 'Stripped Birch Wood', color : 'rgb(194, 170, 113)'}
,{name : 'Stripped Jungle Wood', color : 'rgb(189, 143, 100)'},{name : 'Stripped Acacia Wood', color : 'rgb(176, 90, 58)'}
,{name : 'Stripped Dark Oak Wood', color : 'rgb(94, 74, 48)'},{name : 'Oak Wood', color : 'rgb(150, 119, 73)'}
,{name : 'Spruce Wood', color : 'rgb(46, 29, 11)'},{name : 'Birch Wood', color : 'rgb(234, 232, 224)'}
,{name : 'Jungle Wood', color : 'rgb(98, 87, 32)'},{name : 'Acacia Wood', color : 'rgb(107, 101, 91)'}
,{name : 'Dark Oak Wood', color : 'rgb(53, 41, 24)'},{name : 'Sponge', color : 'rgb(207, 207, 79)'}
,{name : 'Wet Sponge', color : 'rgb(160, 155, 41)'},{name : 'Glace', color : 'rgb(190, 242, 251)'}
,{name : 'Lapis Lazuli Ore', color : 'rgb(114, 114, 114)'},{name : 'Lapis Lazuli Block', color : 'rgb(35, 64, 147)'}
,{name : 'Sandstone', color : 'rgb(219, 211, 163)'},{name : 'Chiseled Sandstone', color : 'rgb(219, 211, 163)'}
,{name : 'Cut Sandstone', color : 'rgb(219, 211, 163)'},{name : 'White Wool', color : 'rgb(249, 255, 255)'},
{name : 'Gray Wool', color : 'rgb(71, 79, 82)'},{name : 'Light Gray Wool', color : 'rgb(156, 157, 151)'},
{name : 'Black Wool', color : 'rgb(29, 28, 33)'},{name : 'Yellow Wool', color : 'rgb(255, 216, 61)'},
{name : 'Orange Wool', color : 'rgb(249, 128, 29)'},{name : 'Red Wool', color : 'rgb(176, 46, 38)'},
{name : 'Brown Wool', color : 'rgb(130, 84, 50)'},{name : 'Lime Wool', color : 'rgb(128, 199, 31)'},
{name : 'Green Wool', color : 'rgb(93, 124, 21)'},{name : 'Light Blue Wool', color : 'rgb(58, 179, 218)'}
,{name : 'Cyan Wool', color : 'rgb(22, 156, 157)'},{name : 'Blue Wool', color : 'rgb(60, 68, 169)'}
,{name : 'Pink Wool', color : 'rgb(243, 140, 170)'},{name : 'Magenta Wool', color : 'rgb(198, 79, 189)'},
{name : 'Purple Wool', color : 'rgb(137, 50, 183)'}
,{name : 'Block of Gold', color : 'rgb(251, 252, 102)'},{name : 'Block of Iron', color : 'rgb(227, 227, 227)'}
,{name : 'Oak Slab', color : 'rgb(148, 119, 77)'},{name : 'Spruce Slab', color : 'rgb(80, 59, 36)'}
,{name : 'Birch Slab', color : 'rgb(157, 141, 97)'},{name : 'Jungle Slab', color : 'rgb(125, 91, 68)'}
,{name : 'Acacia Slab', color : 'rgb(129, 72, 41)'},{name : 'Dark Oak Slab', color : 'rgb(48, 31, 15)'}
,{name : 'Stone Slab', color : 'rgb(110, 110, 110)'},{name : 'Sandstone Slab', color : 'rgb(154, 150, 116)'}
,{name : 'Petrified Oak Slab', color : 'rgb(129, 105, 67)'},{name : 'Cobblestone Slab', color : 'rgb(79, 79, 79)'}
,{name : 'Brick Slab', color : 'rgb(121, 68, 53)'},{name : 'Stone Brick Slab', color : 'rgb(108, 108, 108)'}
,{name : 'Nether Brick Slab', color : 'rgb(46, 21, 25)'},{name : 'Quartz Slab', color : 'rgb(201, 200, 195)'}
,{name : 'Red Sandstone Slab', color : 'rgb(142, 72, 25)'},{name : 'Purpur Slab', color : 'rgb(160, 114, 160)'}
,{name : 'Prismarine Slab', color : 'rgb(65, 122, 107)'},{name : 'Prismarine Brick Slab', color : 'rgb(97, 152, 133)'}
,{name : 'Dark Prismarine Slab', color : 'rgb(37, 61, 51)'},{name : 'Smooth Quartz', color : 'rgb(234, 232, 226)'}
,{name : 'Smooth Red Sandstone', color : 'rgb(166, 84, 30)'},{name : 'Smooth Sandstone', color : 'rgb(219, 211, 163)'}
,{name : 'Smooth Stone', color : 'rgb(166, 166, 166)'},{name : 'Bricks', color : 'rgb(129, 72, 56)'}
,{name : 'Bookshelf', color : 'rgb(186, 150, 97)'},{name : 'Mossy Cobblestone', color : 'rgb(56, 92, 56)'}
,{name : 'Obsidian', color : 'rgb(16, 16, 24)'},{name : 'Purpur Block', color : 'rgb(165, 118, 165)'}
,{name : 'Purpur Pillar', color : 'rgb(142, 100, 142)'},{name : 'Diamond Ore', color : 'rgb(115, 115, 115)'}
,{name : 'Block of Diamond', color : 'rgb(128, 225, 221)'},{name : 'Redstone Ore', color : 'rgb(115, 115, 115)'}
,{name : 'Snow Block', color : 'rgb(224, 240, 240)'}
,{name : 'Clay', color : 'rgb(159, 163, 180)'},{name : 'Pumpkin', color : 'rgb(224, 142, 29)'}
,{name : 'Netherrack', color : 'rgb(180, 106, 106)'}
,{name : 'Soul Sand', color : 'rgb(70, 51, 39)'}
,{name : 'Stone Bricks', color : 'rgb(134, 134, 134)'}
,{name : 'Cracked Stone Bricks', color : 'rgb(120, 120, 120)'},{name : 'Chiseled Stone Bricks', color : 'rgb(105, 105, 105)'}
,{name : 'Melon', color : 'rgb(188, 182, 40)'},{name : 'Mycelium', color : 'rgb(152, 122, 127)'}
,{name : 'Nether Bricks', color : 'rgb(30, 16, 19)'},{name : 'End Stone', color : 'rgb(193, 187, 135)'}
,{name : 'End Stone Bricks', color : 'rgb(240, 242, 196)'},{name : 'Emerald Ore', color : 'rgb(103, 103, 103)'}
,{name : 'Block of Emerald', color : 'rgb(115, 233, 148)'},{name : 'Nether Quartz Ore', color : 'rgb(112, 57, 57)'}
,{name : 'Chiseled Quartz Block', color : 'rgb(224, 220, 210)'},{name : 'Block of Quartz', color : 'rgb(224, 220, 210)'}
,{name : 'Quartz Pillar', color : 'rgb(224, 220, 210)'},{name : 'White Terracotta', color : 'rgb(207, 175, 159)'}
,{name : 'Orange Terracotta', color : 'rgb(157, 81, 36)'},{name : 'Magenta Terracotta', color : 'rgb(145, 85, 106)'}
,{name : 'Light Blue Terracotta', color : 'rgb(111, 107, 136)'},{name : 'Yellow Terracotta', color : 'rgb(182, 128, 33)'}
,{name : 'Lime Terracotta', color : 'rgb(101, 115, 51)'},{name : 'Pink Terracotta', color : 'rgb(157, 74, 75)'}
,{name : 'Gray Terracotta', color : 'rgb(58, 42, 36)'},{name : 'Light Gray Terracotta', color : 'rgb(131, 104, 95)'}
,{name : 'Cyan Terracotta', color : 'rgb(92, 94, 94)'},{name : 'Purple Terracotta', color : 'rgb(114, 67, 83)'}
,{name : 'Blue Terracotta', color : 'rgb(75, 61, 91)'},{name : 'Brown Terracotta', color : 'rgb(78, 52, 36)'}
,{name : 'Green Terracotta', color : 'rgb(74, 81, 41)'},{name : 'Red Terracotta', color : 'rgb(140, 60, 46)'}
,{name : 'Black Terracotta', color : 'rgb(37, 23, 16)'},{name : 'Hay Bale', color : 'rgb(156, 134, 18)'}
,{name : 'Terracotta', color : 'rgb(155, 91, 71)'},{name : 'Block of Coal', color : 'rgb(21, 21, 21)'}
,{name : 'Packed Ice', color : 'rgb(149, 179, 229)'}
,{name : 'White Stained Glass', color : 'rgb(138, 149, 124)'},{name : 'Orange Stained Glass', color : 'rgb(124, 101, 44)'}
,{name : 'Magenta Stained Glass', color : 'rgb(108, 79, 108)'},{name : 'Light Blue Stained Glass', color : 'rgb(77, 108, 107)'}
,{name : 'Yellow Stained Glass', color : 'rgb(125, 135, 41)'},{name : 'Lime Stained Glass', color : 'rgb(84, 124, 30)'}
,{name : 'Pink Stained Glass', color : 'rgb(143, 111, 94)'},{name : 'Gray Stained Glass', color : 'rgb(83, 98, 62)'}
,{name : 'Light Gray Stained Glass', color : 'rgb(101, 114, 86)'},{name : 'Cyan Stained Glass', color : 'rgb(71, 103, 86)'}
,{name : 'Purple Stained Glass', color : 'rgb(96, 85, 99)'},{name : 'Blue Stained Glass', color : 'rgb(68, 94, 117)'}
,{name : 'Brown Stained Glass', color : 'rgb(82, 85, 46)'},{name : 'Green Stained Glass', color : 'rgb(84, 106, 46)'}
,{name : 'Red Stained Glass', color : 'rgb(101, 73, 45)'},{name : 'Black Stained Glass', color : 'rgb(56, 69, 38)'}
,{name : 'Prismarine', color : 'rgb(137, 200, 193)'},{name : 'Prismarine Bricks', color : 'rgb(106, 174, 161)'}
,{name : 'Dark Prismarine', color : 'rgb(62, 96, 86)'},{name : 'Sea Lantern', color : 'rgb(224, 232, 225)'}
,{name : 'Red Sandstone', color : 'rgb(158, 80, 28)'},{name : 'Chiseled Red Sandstone', color : 'rgb(166, 84, 30)'}
,{name : 'Cut Red Sandstone', color : 'rgb(155, 84, 20)'}
,{name : 'Nether Wart Block', color : 'rgb(114, 0, 0)'},{name : 'Red Nether Bricks', color : 'rgb(68, 5, 9)'}
,{name : 'Bone Block', color : 'rgb(178, 172, 144)'},{name : 'White Concrete', color : 'rgb(204, 209, 210)'}
,{name : 'Orange Concrete', color : 'rgb(222, 96, 0)'},{name : 'Magenta Concrete', color : 'rgb(167, 47, 157)'}
,{name : 'Light Blue Concrete', color : 'rgb(36, 136, 198)'},{name : 'Yellow Concrete', color : 'rgb(239, 174, 22)'}
,{name : 'Lime Concrete', color : 'rgb(93, 167, 24)'},{name : 'Pink Concrete', color : 'rgb(211, 100, 141)'}
,{name : 'Gray Concrete', color : 'rgb(53, 56, 60)'},{name : 'Light Gray Concrete', color : 'rgb(124, 124, 114)'}
,{name : 'Cyan Concrete', color : 'rgb(21, 117, 133)'},{name : 'Purple Concrete', color : 'rgb(100, 32, 155)'}
,{name : 'Blue Concrete', color : 'rgb(43, 45, 141)'},{name : 'Brown Concrete', color : 'rgb(96, 59, 32)'}
,{name : 'Green Concrete', color : 'rgb(72, 89, 36)'},{name : 'Red Concrete', color : 'rgb(140, 32, 32)'}
,{name : 'Black Concrete', color : 'rgb(9, 11, 16)'}
,{name : 'White Concrete Powder', color : 'rgb(227, 229, 230)'},{name : 'Orange Concrete Powder', color : 'rgb(217, 119, 19)'}
,{name : 'Magenta Concrete Powder', color : 'rgb(183, 71, 175)'},{name : 'Light Blue Concrete Powder', color : 'rgb(73, 179, 211)'}
,{name : 'Yellow Concrete Powder', color : 'rgb(225, 186, 44)'},{name : 'Lime Concrete Powder', color : 'rgb(131, 198, 43)'}
,{name : 'Pink Concrete Powder', color : 'rgb(225, 135, 172)'},{name : 'Gray Concrete Powder', color : 'rgb(73, 76, 81)'}
,{name : 'Light Gray Concrete Powder', color : 'rgb(145, 145, 138)'},{name : 'Cyan Concrete Powder', color : 'rgb(39, 150, 166)'}
,{name : 'Purple Concrete Powder', color : 'rgb(126, 53, 174)'},{name : 'Blue Concrete Powder', color : 'rgb(69, 72, 165)'}
,{name : 'Brown Concrete Powder', color : 'rgb(125, 82, 53)'},{name : 'Green Concrete Powder', color : 'rgb(90, 112, 43)'}
,{name : 'Red Concrete Powder', color : 'rgb(167, 54, 49)'},{name : 'Black Concrete Powder', color : 'rgb(22, 24, 30)'}


]


function GetClosest(color, advanced = false)
{
    color = StringColors(color);
    var minDiff = 1000;
    var index=0;
    var ColorsData = advanced ? AdvancedColors : MineCraftColors;
    let i = 0;


    while (i < ColorsData.length) {
        let currColor = StringColors(ColorsData[i].color);
        if(colorDifference(color[0],color[1],color[2],currColor[0],currColor[1],currColor[2]) < minDiff)
        {
            minDiff = colorDifference(color[0],color[1],color[2],currColor[0],currColor[1],currColor[2]);
            index = i;
        }
        i++;
    }
    // for (let i = 0; i < ColorsData.length; i++) {
    //     let currColor = StringColors(ColorsData[i].color);
    //     if(colorDifference(color[0],color[1],color[2],currColor[0],currColor[1],currColor[2]) < minDiff)
    //     {
    //         minDiff = colorDifference(color[0],color[1],color[2],currColor[0],currColor[1],currColor[2]);
    //         index = i;
    //     }
        
    // }
    // const found = ItemsRequired.findIndex(el => el.itemName === ColorsData[index].name);
    // if(found > -1) {
    //     ItemsRequired[found].number ++;
    // }
    // else
    // {
    //     ItemsRequired.push({ number : 1, itemName: ColorsData[index].name });
    // }
    return ColorsData[index].color;

}

function detectItemsName(color)
{
    return AdvancedColors.find(c => c.color === color).name;
}
function getIconClassName(Name)
{
    return 'icon-minecraft-' + Name.toLowerCase().replace(/\s/g, '-');
}

function StringColors(rgb)
{
    if(rgb.substring(0,4) == 'rgba')
    {
        return rgb.substring(5, rgb.length-1)
    .replace(/ /g, '')
    .split(',');
    }else 
    {
        return rgb.substring(4, rgb.length-1)
    .replace(/ /g, '')
    .split(',');
    }
}

function colorDifference (r1, g1, b1, r2, g2, b2) {
    var sumOfSquares = 0;

    sumOfSquares += Math.pow(r1 - r2, 2);
    sumOfSquares += Math.pow(g1 - g2, 2);
    sumOfSquares += Math.pow(b1 - b2, 2);
    
    return Math.sqrt(sumOfSquares);
}