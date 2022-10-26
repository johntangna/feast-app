/**
 * @author Charles Ran 
 * @since 2021.09.10
 * @version 1.0  
 * @function JSON 格式数据导出为Excel文件(支持多个Sheet页导出)
 */
export const rcExcel = function() {
    return {
 
        ExportToExcel: function(options) {
            var loopSheet = undefined;
            var fileName = options.fileName ? options.fileName : "MyRevenueReport";
 
            var loopSheetTitles = "";
            var loopSheetData = "";
 
            var sheetName = "";
 
            var tmplWorkbookXML = '<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">' +
                '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Title>Excel表格</Title><LastAuthor>bigtall</LastAuthor></DocumentProperties>' +
                '<Styles>' +
                '<Style ss:ID="def_titles" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Font ss:FontName="宋体" x:CharSet="134" ss:Size="12"/></Style>' +
                '<Style ss:ID="def_data">ss:Name="Normal"><Alignment ss:Vertical="Center"/><Font ss:FontName="宋体" x:CharSet="134" ss:Size="12"/></Style>' +
                '</Styles>' +
                '{worksheets}</Workbook>',
                tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>',
                tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>';
 
            var ctx = "";
            var workbookXML = "";
            var worksheetsXML = "";
            var rowsXML = "";
 
            if (typeof(fileName) != "string") { return };
 
            var dataValue = "";
            var dataType = "";
            var dataStyle = "";
            var dataFormula = "";
 
            for (var i = 0; i < options.sheets.length; i++) { //loop Sheet
 
                loopSheet = options.sheets[i];
                loopSheetTitles = loopSheet.titles;
                loopSheetData = loopSheet.data;
 
                sheetName = loopSheet.name ? loopSheet.name : this.defaultOptions.sheetName;
 
                if (loopSheetTitles && typeof(loopSheetTitles) != "object") { continue; };
                if (loopSheetData && typeof(loopSheetData) != "object") { continue; };
 
                //每一列的标题 开始
                rowsXML += '<Row>';
                for (var k = 0; k < loopSheetTitles.length; k++) {
 
                    dataValue = loopSheetTitles[k];
                    dataType = typeof dataValue;
                    dataStyle = "def_titles";
                    dataFormula = undefined;
 
                    ctx = {
                        attributeStyleID: ' ss:StyleID="' + dataStyle + '"',
                        nameType: (dataType == 'Number' || dataType == 'DateTime' || dataType == 'Boolean' || dataType == 'Error') ? dataType : 'String',
                        data: (dataFormula) ? '' : dataValue,
                        attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : ''
                    };
                    rowsXML += this.format(tmplCellXML, ctx);
                }
                rowsXML += '</Row>';
                //每一列的标题 结束
 
                //数据
                for (var j = 0; j < loopSheet.data.length; j++) {
 
                    rowsXML += '<Row>';
 
                    for (var index in loopSheet.data[j]) {
 
                        dataValue = loopSheet.data[j][index] === "." ? "" : loopSheet.data[j][index];
                        dataType = typeof dataValue;
                        dataStyle = "def_data";
                        dataFormula = undefined;
 
                        ctx = {
                            attributeStyleID: ' ss:StyleID="' + dataStyle + '"',
                            nameType: (dataType == 'Number' || dataType == 'DateTime' || dataType == 'Boolean' || dataType == 'Error') ? dataType : 'String',
                            data: (dataFormula) ? '' : dataValue,
                            attributeFormula: (dataFormula) ? ' ss:Formula="' + dataFormula + '"' : ''
                        };
                        rowsXML += this.format(tmplCellXML, ctx);
                    }
 
                    rowsXML += '</Row>';
                }
                ctx = { rows: rowsXML, nameWS: sheetName || 'Sheet' + i };
                worksheetsXML += this.format(tmplWorksheetXML, ctx);
                rowsXML = "";
            }
 
            ctx = { created: (new Date()).getTime(), worksheets: worksheetsXML };
            workbookXML = this.format(tmplWorkbookXML, ctx);
 
            this.saveAs(new Blob([workbookXML], { type: 'text/xml' }), fileName);
 
        },
        saveAs: function(blob, fileName) {
            var tmpa = document.createElement("a");
            tmpa.download = fileName ? fileName + '.xml' : new Date().getTime() + '.xml';
            tmpa.href = URL.createObjectURL(blob); //绑定a标签
            tmpa.click(); //模拟点击实现下载
            setTimeout(function() { //延时释放
                URL.revokeObjectURL(blob); //用URL.revokeObjectURL()来释放这个object URL
            }, 100);
        },
        format: function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            })
        },
        info: function() {
            return this.defaultOptions.plugin;
        },
        defaultOptions: {
            sheetName: "我的收益数据",
            plugin: {
                author: "Charles Ran",
                version: "1.0"
            }
        }
    }
}();