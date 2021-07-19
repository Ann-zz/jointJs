window.onload=function() {
    var graph = new joint.dia.Graph();

    var ElementView = joint.dia.ElementView.extend({
        pointerdown: function () {
            this._click = true;
            joint.dia.ElementView.prototype.pointerdown.apply(this, arguments);
        },
        pointermove: function(evt, x, y) {
            this._click = false;
            joint.dia.ElementView.prototype.pointermove.apply(this, arguments);
        },
        pointerup: function (evt, x, y) {
            if (this._click) {
                // triggers an event on the paper and the element itself
                this.notify('cell:click', evt, x, y); 
            } else {
                joint.dia.ElementView.prototype.pointerup.apply(this, arguments);
            }
        }
    });
    var LinkView = joint.dia.LinkView.extend({
        addVertex: function(evt, x, y) {},
        removeVertex: function(endType) {},
        pointerdown:function(evt, x, y) {}
    });
    
    //定义画布
    var paper = new joint.dia.Paper({
        el: $('#paper'),
        width: 1200,
        height: 600,
        gridSize: 1,
        model: graph,
        elementView: ElementView,
        linkView:LinkView
    });

    //定义形状
    function state(x, y, shape, text, url){
        // 参数可视情况修改
        var cell;
        if(shape==="rect"){
            cell = new joint.shapes.basic.Rect({
                position: { x: x, y: y },//坐标
                size: { width: 140, height: 40 },//宽高
                attrs: { 
                    rect: {
                        fill: {
                            type: 'linearGradient',
                            stops: [
                                { offset: '0%', color: '#f7a07b' },//渐变开始
                                { offset: '100%', color: '#fe8550' }//渐变结束
                            ],
                            attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
                        },
                        stroke: '#f7a07b',//边框颜色
                        'stroke-width': 1//边框大小
                    },
                    text: { text: text }, //显示文字
                    url: url
                }
            });
        } else if(shape==="ellipse"){
            cell = new joint.shapes.basic.Ellipse({
                position: { x: x, y: y },//坐标
                size: { width: 140, height: 40 },//宽高
                attrs: { 
                    ellipse: {
                        fill: {
                            type: 'linearGradient',
                            stops: [
                                { offset: '0%', color: '#f7a07b' },//渐变开始
                                { offset: '100%', color: 'red' }//渐变结束
                            ],
                            attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
                        },
                        stroke: '#f7a07b',//边框颜色
                        'stroke-width': 1//边框大小
                    },
                    text: { text: text }, //显示文字
                    url: url
                }
            });
        }
        graph.addCell(cell);
        cell.toBack();
        return cell;
    };
    
    //定义连线
    function link(source, target, label){
        var cell = new joint.dia.Link({ 
            source: { id: source.id },
            target: { id: target.id },
            labels: [{ position: 0.5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }],//设置连线文本
            router: { name: 'manhattan' },//设置连线弯曲样式 manhattan直角
            attrs: {
                '.connection': {
                    stroke: '#333333',//连线颜色
                    'stroke-width': 2//连线粗细
                },
                '.marker-target': {
                    fill: '#333333',//箭头颜色
                    d: 'M 10 0 L 0 5 L 10 10 z'//箭头样式
                }
            }
        });
        graph.addCell(cell);
        cell.toBack();
        return cell;
    }

    // 直接创建图形展示形式
    // //创建元素
    // var start = state(500,100,"rect",'启明星辰','url');
    // var state1 = state(500,200,"rect", "Demo1",'url');
    
    // //创建连线
    // link(start,state1,"");

    // 模拟数据填充形式
    var demo = [
        {
            text: '启明星辰',
            id: '1',
            url: 'w1',
            child: [
                {
                    text: '测试项1',
                    url: 'w2',
                    id: '2',
                    child: []
                }, {
                    text: '测试项2',
                    url: 'w3',
                    id: '3',
                    child: []
                }, {
                    text: '测试项3',
                    url: 'w4',
                    id: '4',
                }
            ]
        }
    ]

    // 创建图形
    var demolist = [];
    $.each(demo, function (index, item) { 
        // 可自定义图形位置
        var elementLeft = index + 1 * 100
        var elementTop = index + 1 * 100 
        demolist[item.id] = state(elementLeft, elementTop, "ellipse", item.text, item.url)
         if (item.child.length > 0) {
             $.each(item.child, function (index2, item2) { 
                // 图形定位展示
                var elementLeft2 = elementLeft + (index2 +1 *300)
                var elementTop2 = elementTop + (index2*150)
                demolist[item2.id] = state(elementLeft2, elementTop2, "rect", item2.text, item2.url)
                link(demolist[item.id], demolist[item2.id])
             });
         }
    });

    //给所有元素添加点击事件
    paper.on('cell:click', function (e) {
        alert(e.model.attributes.attrs.url)
    });
}
