/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
 define(['N/search', 'N/record'],
    function(search, record){
        return {
             execute: function (context)
            {
                var filter1 = search.createFilter({
                    name: 'mainline',
                    operator: search.Operator.IS,
                    values: true
                    });
                var filter2 = search.createFilter({
                    name: 'status',
                    operator: search.Operator.ANYOF,
                    values: ['WorkOrd:A', 'WorkOrd:B']
                    });
                var filter3 = search.createFilter({
                    name: 'custbody_aps_to_update',
                    operator: search.Operator.IS,
                    values: true
                    });
                var srch = search.create({
                    type: search.Type.WORK_ORDER,
                    filters: [filter1, filter2, filter3],
                    columns: []
                    });
                var pagedResults = srch.runPaged();
                pagedResults.pageRanges.forEach(function(pageRange){
                var currentPage = pagedResults.fetch({index: pageRange.index});
                currentPage.data.forEach(function(result){
                log.debug({
                    details: 'work order id: ' + result.id
                });
                var wo = record.load({
                    type: record.Type.WORK_ORDER,
                    id: result.id
                    });

                var isWip = wo.getValue({
                    fieldId: 'iswip'
                });
                log.debug({
                    details: 'work order is wip:' + isWip
                });
                // UPDATE wo FIELDS
                // wo.setValue({
                //     fieldId: 'custbody_aps_to_update',
                //     value: false
                //     });
                
                wo.setValue({
                    fieldId: 'iswip',
                    value: false
                })
                wo.save()
                });
            });
        }
    }
 });