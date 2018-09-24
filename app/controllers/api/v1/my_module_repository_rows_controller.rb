# frozen_string_literal: true

module Api
  module V1
    class MyModuleRepositoryRowsController < BaseController
      before_action :load_team
      before_action :load_project
      before_action :load_experiment
      before_action :load_task
      before_action :load_task_repository_row, only: :show

      def index
        repo_rows = @my_module.my_module_repository_rows
                              .page(params.dig(:page, :number))
                              .per(params.dig(:page, :size))

        render jsonapi: repo_rows,
          each_serializer: MyModuleRepositoryRowSerializer
      end

      def show
        render jsonapi: @repo_row, serializer: MyModuleRepositoryRowSerializer
      end

      private

      def load_team
        @team = Team.find(params.require(:team_id))
        render jsonapi: {}, status: :forbidden unless can_read_team?(@team)
      end

      def load_project
        @project = @team.projects.find(params.require(:project_id))
        render jsonapi: {}, status: :forbidden unless can_read_project?(
          @project
        )
      end

      def load_experiment
        @experiment = @project.experiments.find(params.require(:experiment_id))
        render jsonapi: {}, status: :forbidden unless can_read_experiment?(
          @experiment
        )
      end

      def load_task
        @my_module = @experiment.my_modules.find(params.require(:task_id))
        render jsonapi: {}, status: :not_found if @my_module.nil?
      end

      def load_task_repository_row
        @repo_row = @my_module.my_module_repository_rows.find(
          params.require(:id)
        )
        render jsonapi: {}, status: :not_found if @repo_row.nil?
      end
    end
  end
end