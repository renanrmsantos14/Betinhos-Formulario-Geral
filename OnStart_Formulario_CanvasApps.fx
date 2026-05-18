Set(varpopupLoading; true);;

Set(varResettxt; "a");;
Set(varvazio; "");;
Set(varTxtObs; "");;
Set(varPreferencias1; "");;
Set(varPreferencias2; "");;
Set(varPreferencias3; "");;
Set(varPreferencias4; "");;
Set(TipoObsAtual; "Motorista");;
Set(varSaveTriggered; false);;
Set(varSuccessMessage; "");;
Set(varNomePassageiro; "");;

Set(gblRecordId; Param("id"));;
Set(gblIsNewRecord; IsBlank(gblRecordId));;
Set(gblRegistroAtual; Blank());;

If(
    !gblIsNewRecord;
    With(
        {
            _reg: LookUp(
                [@'Reserva de veículos'];
                'GUID Reserva de Veículos' = GUID(gblRecordId)
            )
        };
        Set(ObsInterna; _reg.'Observação interna');;
        Set(ObsMotorista; _reg.'Obs de Operação');;
        Set(ObsFinal; _reg.'Observação Final');;
        Set(
            gblRegistroAtual;
            {
                cr40f_enderecodesada: _reg.'Ed de Saída - VIEW';
                Cliente: _reg.Cliente;
                cr40f_Cotao: _reg.Cotação;
                cr40f_CR: _reg.CR;
                cr40f_Dataehorriodesada: _reg.'Data e horário de saída';
                cr40f_Destino: _reg.Destino;
                cr40f_FormadePagamento: _reg.'Forma de Pagamento';
                cr40f_Horrioprevistoderetorno: _reg.'Previsão de retorno';
                cr40f_ObsdeOperao: _reg.'Obs de Operação';
                cr40f_Observaointerna: _reg.'Observação interna';
                'Passageiro 1': _reg.'Passageiro 1';
                'Passageiro 2': _reg.'Passageiro 2';
                'Passageiro 3': _reg.'Passageiro 3';
                'Passageiro 4': _reg.'Passageiro 4';
                Solicitante: _reg.Solicitante;
                cr40f_Status: _reg.'Status de Operação';
                cr40f_TipodeVeiculo: _reg.'Tipo de Veículo';
                cr40f_TipodoServico: _reg.'Tipo do Serviço';
                cr40f_Trajeto: _reg.Trajeto;
                Motorista: _reg.Motorista;
                ID: _reg.ID
            }
        )
    )
);;

Set(varCurrentTab; "Detalhes");;
Set(TipoObsAtual; "Motorista");;

If(
    !gblIsNewRecord;
    ClearCollect(
        colOrdemPassageiros;
        ForAll(
            SortByColumns(
                Filter(
                    'Serviços por Passageiro';
                    'Geral (Coluna Serviços por Passageiro)'.'GUID Reserva de Veículos' = GUID(gblRecordId)
                );
                "cr40f_ordemdeselecao";
                SortOrder.Ascending
            );
            {
                Passageiro: ThisRecord.'Banco de Dados (Coluna Serviços por Passageiro)';
                OrdemSelecao: ThisRecord.'Ordem de Seleção (Coluna Serviços por Passageiro)';
                GUIDPassageiro: ThisRecord.'Banco de Dados (Coluna Serviços por Passageiro)'.'GUID Banco de Dados';
                EnderecoSaidaBD: ThisRecord.'Banco de Dados (Coluna Serviços por Passageiro)'.'Endereço de Saída'
            }
        )
    );
    Clear(colOrdemPassageiros)
);;

If(
    gblIsNewRecord;
    ClearCollect(
        colPassageirosServico;
        {
            OrdemSelecao: 1;
            Passageiro: Blank();
            GUIDPassageiro: "";
            RegistroBD: Blank();
            Telefone: "";
            EnderecoEditado: ""
        }
    );;
    ClearCollect(
        colEnderecoRascunho;
        {
            OrdemSelecao: 1;
            EnderecoDigitado: ""
        }
    )
);;

If(
    !gblIsNewRecord;
    ClearCollect(
        colPassageirosServico;
        ForAll(
            SortByColumns(
                Filter(
                    'Serviços por Passageiro';
                    'Geral (Coluna Serviços por Passageiro)'.'GUID Reserva de Veículos' = GUID(gblRecordId)
                );
                "cr40f_ordemdeselecao";
                SortOrder.Ascending
            );
            {
                OrdemSelecao: ThisRecord.'Ordem de Seleção (Coluna Serviços por Passageiro)';
                Passageiro: ThisRecord.'Banco de Dados (Coluna Serviços por Passageiro)';
                GUIDPassageiro: Text(ThisRecord.'Banco de Dados (Coluna Serviços por Passageiro)'.'GUID Banco de Dados');
                RegistroBD: ThisRecord.'Banco de Dados (Coluna Serviços por Passageiro)';
                Telefone: ThisRecord.'Banco de Dados (Coluna Serviços por Passageiro)'.Telefone;
                EnderecoEditado: ThisRecord.'Endereço de Saída (Coluna Serviços por Passageiro)'
            }
        )
    );;
    ClearCollect(
        colEnderecoRascunho;
        ForAll(
            colPassageirosServico As _item;
            {
                OrdemSelecao: _item.OrdemSelecao;
                EnderecoDigitado: Coalesce(_item.EnderecoEditado; "")
            }
        )
    )
);;

Set(varpopupLoading; false)